<?php
/**
 * Wonderlyf Headless Integration
 *
 * Paste everything between <?php and end of file into a NEW snippet in the
 * WordPress "Code Snippets" plugin. Set it to "Run snippet everywhere" and
 * activate.
 *
 * IMPORTANT: Before activating, change WONDERLYF_FRONTEND_URL below to your
 * deployed React app URL (keep localhost:5173 only while you develop).
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Front-end URL (where customers land after checkout) ──────────────────
if ( ! defined( 'WONDERLYF_FRONTEND_URL' ) ) {
    define( 'WONDERLYF_FRONTEND_URL', 'https://wonderlyf.co.uk' );
}

// WordPress's wp_safe_redirect() refuses to redirect to hosts it doesn't
// know. Since our front-end lives on a different subdomain, whitelist it
// explicitly — otherwise WP silently falls back to /wp-admin/ (the login
// screen) which is what was happening after Place Order.
add_filter( 'allowed_redirect_hosts', function ( $hosts ) {
    $frontend_host = parse_url( WONDERLYF_FRONTEND_URL, PHP_URL_HOST );
    if ( $frontend_host && ! in_array( $frontend_host, $hosts, true ) ) {
        $hosts[] = $frontend_host;
    }
    return $hosts;
} );

// ── Origin whitelist for CORS and prefill-cart ───────────────────────────
function wonderlyf_allowed_origins() {
    return apply_filters( 'wonderlyf_allowed_origins', [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://wonderlyf.co.uk',
        'https://www.wonderlyf.co.uk',
    ] );
}

function wonderlyf_send_cors_headers() {
    $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ( ! $origin ) return;
    if ( ! in_array( $origin, wonderlyf_allowed_origins(), true ) ) return;

    // Remove anything set by other plugins / LiteSpeed first, otherwise
    // duplicate or conflicting headers can cause the browser to reject.
    header_remove( 'Access-Control-Allow-Origin' );
    header_remove( 'Access-Control-Allow-Credentials' );
    header_remove( 'Access-Control-Allow-Methods' );
    header_remove( 'Access-Control-Allow-Headers' );
    header_remove( 'Access-Control-Expose-Headers' );

    header( 'Access-Control-Allow-Origin: ' . $origin );
    header( 'Vary: Origin' );
    header( 'Access-Control-Allow-Credentials: true' );
    header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Authorization, Content-Type, Cart-Token, Nonce, X-WP-Nonce' );
    header( 'Access-Control-Expose-Headers: Cart-Token, Nonce, X-WP-Nonce, Link' );
}

// Short-circuit OPTIONS preflight requests with proper CORS headers.
add_action( 'init', function () {
    if ( 'OPTIONS' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) return;
    if ( strpos( $_SERVER['REQUEST_URI'] ?? '', '/wp-json/' ) === false ) return;
    wonderlyf_send_cors_headers();
    status_header( 200 );
    exit;
}, 0 );

// Send CORS headers on EVERY /wp-json/* response — fires very early at the
// HTTP layer so plugins / cache layers can't strip them.
add_action( 'send_headers', function () {
    if ( strpos( $_SERVER['REQUEST_URI'] ?? '', '/wp-json/' ) === false ) return;
    wonderlyf_send_cors_headers();
}, 1 );

// Belt-and-suspenders: inject at the REST layer too (in case send_headers
// runs before WooCommerce's own late-stage headers override ours).
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        wonderlyf_send_cors_headers();
        return $value;
    }, 100 );
}, 15 );

// Tell LiteSpeed Cache to NEVER cache any REST / Store API response —
// cached CORS headers with a stale Origin will break other visitors.
add_action( 'init', function () {
    if ( strpos( $_SERVER['REQUEST_URI'] ?? '', '/wp-json/' ) !== false ) {
        if ( ! defined( 'DONOTCACHEPAGE' ) ) define( 'DONOTCACHEPAGE', true );
        do_action( 'litespeed_control_set_nocache', 'REST API response' );
    }
}, 1 );

// ── Exempt REST from "Coming soon" plugins ───────────────────────────────
add_action( 'init', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if ( strpos( $uri, '/wp-json/' ) !== false ) {
        add_filter( 'seed_csp4_is_active', '__return_false' );
        add_filter( 'csp_is_coming_soon_active', '__return_false' );
        add_filter( 'cspm_force_disable', '__return_true' );
    }
}, 1 );

// ── One-shot order-placement endpoint ────────────────────────────────────
// The React checkout form POSTs all billing, shipping, payment, and items
// straight to this endpoint. We build the cart server-side, create the
// order, trigger the payment gateway, and redirect the browser to the
// React thank-you page. Because it's a top-level form navigation there
// is no CORS involved.
add_action( 'wp_loaded', function () {
    if ( ( $_POST['wonderlyf_action'] ?? '' ) !== 'place_order' ) return;
    if ( ! function_exists( 'WC' ) || ! WC()->cart ) return;

    // Origin / referer check
    $origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    $allowed = wonderlyf_allowed_origins();
    $ok = $origin && in_array( $origin, $allowed, true );
    if ( ! $ok ) {
        foreach ( $allowed as $a ) {
            if ( $referer && strpos( $referer, $a ) === 0 ) { $ok = true; break; }
        }
    }
    if ( ! $ok ) { status_header( 403 ); exit( 'Origin not allowed' ); }

    // Rebuild cart from the posted items
    WC()->cart->empty_cart();
    $items = json_decode( wp_unslash( $_POST['items'] ?? '[]' ), true );
    if ( empty( $items ) || ! is_array( $items ) ) {
        wp_safe_redirect( trailingslashit( WONDERLYF_FRONTEND_URL ) . 'cart?error=empty' );
        exit;
    }
    foreach ( $items as $item ) {
        $id  = absint( $item['id']  ?? 0 );
        $qty = max( 1, absint( $item['qty'] ?? 1 ) );
        $vid = absint( $item['variation_id'] ?? 0 );
        if ( ! $id ) continue;

        $variation = [];
        if ( $vid ) {
            // Auto-fill variation attributes so WC accepts the add_to_cart call.
            $variation = wc_get_product_variation_attributes( $vid );
        }
        WC()->cart->add_to_cart( $id, $qty, $vid, $variation );
    }
    if ( WC()->cart->is_empty() ) {
        wp_safe_redirect( trailingslashit( WONDERLYF_FRONTEND_URL ) . 'cart?error=cart_rejected' );
        exit;
    }

    // Build billing/shipping address arrays from form fields
    $fields = [ 'first_name', 'last_name', 'company', 'address_1', 'address_2',
                'city', 'state', 'postcode', 'country', 'phone' ];
    $billing  = [];
    $shipping = [];
    foreach ( $fields as $f ) {
        $billing[ $f ]  = sanitize_text_field( wp_unslash( $_POST[ 'billing_' . $f ]  ?? '' ) );
        $shipping[ $f ] = sanitize_text_field( wp_unslash( $_POST[ 'shipping_' . $f ] ?? $billing[ $f ] ) );
    }
    $billing['email'] = sanitize_email( wp_unslash( $_POST['billing_email'] ?? '' ) );

    $payment_method = sanitize_text_field( wp_unslash( $_POST['payment_method'] ?? 'cod' ) );
    $customer_note  = sanitize_textarea_field( wp_unslash( $_POST['customer_note'] ?? '' ) );

    // Set customer session data so shipping rates / taxes calculate correctly
    WC()->customer->set_billing_address_1( $billing['address_1'] );
    WC()->customer->set_billing_city( $billing['city'] );
    WC()->customer->set_billing_postcode( $billing['postcode'] );
    WC()->customer->set_billing_country( $billing['country'] ?: 'GB' );
    WC()->customer->set_shipping_address_1( $shipping['address_1'] );
    WC()->customer->set_shipping_city( $shipping['city'] );
    WC()->customer->set_shipping_postcode( $shipping['postcode'] );
    WC()->customer->set_shipping_country( $shipping['country'] ?: 'GB' );
    WC()->customer->save();
    WC()->cart->calculate_totals();

    // Create the order
    $order = wc_create_order();
    foreach ( WC()->cart->get_cart() as $cart_item ) {
        $order->add_product(
            $cart_item['data'],
            $cart_item['quantity'],
            [ 'totals' => [
                'subtotal'     => $cart_item['line_subtotal'],
                'subtotal_tax' => $cart_item['line_subtotal_tax'],
                'total'        => $cart_item['line_total'],
                'tax'          => $cart_item['line_tax'],
                'tax_data'     => $cart_item['line_tax_data'],
            ] ]
        );
    }
    $order->set_address( $billing,  'billing' );
    $order->set_address( $shipping, 'shipping' );
    $order->set_customer_note( $customer_note );

    // Attach shipping (use the first available rate for the current package)
    $packages = WC()->shipping()->calculate_shipping( WC()->cart->get_shipping_packages() );
    foreach ( $packages as $pkg_key => $pkg ) {
        if ( empty( $pkg['rates'] ) ) continue;
        $rate = reset( $pkg['rates'] );
        $ship = new WC_Order_Item_Shipping();
        $ship->set_method_title( $rate->label );
        $ship->set_method_id( $rate->method_id );
        $ship->set_instance_id( $rate->instance_id ?? 0 );
        $ship->set_total( $rate->cost );
        $ship->set_taxes( [ 'total' => $rate->taxes ] );
        $order->add_item( $ship );
    }

    // Payment method
    $gateways = WC()->payment_gateways->get_available_payment_gateways();
    if ( ! isset( $gateways[ $payment_method ] ) ) {
        wp_safe_redirect( trailingslashit( WONDERLYF_FRONTEND_URL ) . 'checkout?error=payment' );
        exit;
    }
    $gateway = $gateways[ $payment_method ];
    $order->set_payment_method( $gateway );

    $order->calculate_totals();
    $order->save();

    // Let the gateway process it
    $result = $gateway->process_payment( $order->get_id() );

    if ( ! empty( $result['result'] ) && $result['result'] === 'success' ) {
        WC()->cart->empty_cart();
        // PayPal etc. return a redirect URL to their site
        if ( ! empty( $result['redirect'] ) && strpos( $result['redirect'], 'order-received' ) === false ) {
            wp_safe_redirect( $result['redirect'] );
            exit;
        }
        // COD / BACS etc. — send customer back to React thank-you page
        $target = trailingslashit( WONDERLYF_FRONTEND_URL ) . 'order/' . $order->get_id()
            . '?key=' . rawurlencode( $order->get_order_key() )
            . '&email=' . rawurlencode( $billing['email'] );
        wp_safe_redirect( $target );
        exit;
    }

    // Failure
    $order->update_status( 'failed', 'Payment gateway rejected the order.' );
    wp_safe_redirect( trailingslashit( WONDERLYF_FRONTEND_URL ) . 'checkout?error=payment_failed' );
    exit;
}, 20 );

// ── Prefill-cart endpoint (legacy fallback — kept for safety) ─────────────
add_action( 'wp_loaded', function () {
    if ( ( $_POST['wonderlyf_action'] ?? '' ) !== 'prefill_cart' ) return;
    if ( ! function_exists( 'WC' ) || ! WC()->cart ) return;

    $origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    $allowed = wonderlyf_allowed_origins();
    $ok = $origin && in_array( $origin, $allowed, true );
    if ( ! $ok ) {
        foreach ( $allowed as $a ) {
            if ( $referer && strpos( $referer, $a ) === 0 ) { $ok = true; break; }
        }
    }
    if ( ! $ok ) { status_header( 403 ); exit( 'Origin not allowed' ); }

    WC()->cart->empty_cart();
    $items = json_decode( wp_unslash( $_POST['items'] ?? '[]' ), true );
    if ( is_array( $items ) ) {
        foreach ( $items as $item ) {
            $id  = absint( $item['id']  ?? 0 );
            $qty = max( 1, absint( $item['qty'] ?? 1 ) );
            if ( $id ) WC()->cart->add_to_cart( $id, $qty );
        }
    }
    wp_safe_redirect( wc_get_checkout_url() );
    exit;
}, 20 );

// ── Return to React thank-you page after WP checkout ─────────────────────
add_filter( 'woocommerce_get_return_url', function ( $return_url, $order ) {
    if ( ! $order ) return $return_url;
    return trailingslashit( WONDERLYF_FRONTEND_URL ) . 'order/' . $order->get_id()
        . '?key=' . rawurlencode( $order->get_order_key() );
}, 10, 2 );

add_action( 'template_redirect', function () {
    if ( ! function_exists( 'is_order_received_page' ) ) return;
    if ( ! is_order_received_page() ) return;
    $order_id = absint( get_query_var( 'order-received' ) );
    if ( ! $order_id ) return;
    $key = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : '';
    if ( ! $key ) {
        $order = wc_get_order( $order_id );
        if ( $order ) $key = $order->get_order_key();
    }
    wp_redirect( trailingslashit( WONDERLYF_FRONTEND_URL ) . 'order/' . $order_id
        . '?key=' . rawurlencode( $key ) );
    exit;
}, 5 );
