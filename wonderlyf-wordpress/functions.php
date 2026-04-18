<?php
/**
 * Wonderlyf Theme Functions
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Theme Setup ───────────────────────────────────────────────
function wonderlyf_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption' ] );
    add_theme_support( 'custom-logo', [
        'height'      => 100,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ]);

    register_nav_menus([
        'primary' => __( 'Primary Menu', 'wonderlyf' ),
        'footer'  => __( 'Footer Menu', 'wonderlyf' ),
    ]);
}
add_action( 'after_setup_theme', 'wonderlyf_setup' );

// ── Enqueue Styles & Scripts ──────────────────────────────────
function wonderlyf_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'wonderlyf-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap',
        [],
        null
    );

    // Main CSS
    wp_enqueue_style(
        'wonderlyf-main',
        get_template_directory_uri() . '/assets/css/main.css',
        [ 'wonderlyf-fonts' ],
        wp_get_theme()->get( 'Version' )
    );

    // Main JS
    wp_enqueue_script(
        'wonderlyf-main',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        wp_get_theme()->get( 'Version' ),
        true
    );

    // Pass AJAX URL & site data to JS
    wp_localize_script( 'wonderlyf-main', 'wonderlyfData', [
        'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
        'siteUrl'  => get_site_url(),
        'cartUrl'  => wc_get_cart_url(),
        'shopUrl'  => get_permalink( wc_get_page_id( 'shop' ) ),
        'nonce'    => wp_create_nonce( 'wonderlyf_nonce' ),
        'cartCount'=> WC()->cart ? WC()->cart->get_cart_contents_count() : 0,
    ]);
}
add_action( 'wp_enqueue_scripts', 'wonderlyf_scripts' );

// ── WooCommerce: Remove default wrapper ──────────────────────
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content',  'woocommerce_output_content_wrapper_end', 10 );

function wonderlyf_woo_wrapper_start() { echo '<div class="woo-content container">'; }
function wonderlyf_woo_wrapper_end()   { echo '</div>'; }
add_action( 'woocommerce_before_main_content', 'wonderlyf_woo_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content',  'wonderlyf_woo_wrapper_end', 10 );

// ── WooCommerce: Product loop columns ────────────────────────
add_filter( 'loop_shop_columns', fn() => 3 );
add_filter( 'loop_shop_per_page', fn() => 12 );

// ── AJAX: Add to Cart (returns cart count) ───────────────────
function wonderlyf_add_to_cart() {
    check_ajax_referer( 'wonderlyf_nonce', 'nonce' );
    $product_id = absint( $_POST['product_id'] ?? 0 );
    if ( $product_id && WC()->cart->add_to_cart( $product_id ) ) {
        wp_send_json_success([
            'count'   => WC()->cart->get_cart_contents_count(),
            'message' => 'Added to cart!',
        ]);
    }
    wp_send_json_error( [ 'message' => 'Could not add to cart.' ] );
}
add_action( 'wp_ajax_wonderlyf_add_to_cart',        'wonderlyf_add_to_cart' );
add_action( 'wp_ajax_nopriv_wonderlyf_add_to_cart', 'wonderlyf_add_to_cart' );

// ── Widget Areas ─────────────────────────────────────────────
function wonderlyf_widgets_init() {
    register_sidebar([
        'name'          => __( 'Shop Sidebar', 'wonderlyf' ),
        'id'            => 'shop-sidebar',
        'before_widget' => '<div class="sidebar-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="sidebar-title">',
        'after_title'   => '</h3>',
    ]);
}
add_action( 'widgets_init', 'wonderlyf_widgets_init' );

// ── Remove WooCommerce default styles (we use our own) ───────
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

// ── Performance: Preconnect Google Fonts ─────────────────────
function wonderlyf_resource_hints( $urls, $relation_type ) {
    if ( 'preconnect' === $relation_type ) {
        $urls[] = 'https://fonts.googleapis.com';
        $urls[] = 'https://fonts.gstatic.com';
    }
    return $urls;
}
add_filter( 'wp_resource_hints', 'wonderlyf_resource_hints', 10, 2 );

// ── Cart fragment update (for AJAX cart count) ───────────────
function wonderlyf_cart_count_fragment( $fragments ) {
    $fragments['.cart-count'] = '<span class="cart-count">' . WC()->cart->get_cart_contents_count() . '</span>';
    return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'wonderlyf_cart_count_fragment' );

// ── Include Files ─────────────────────────────────────────────
require_once get_template_directory() . '/inc/performance.php';
require_once get_template_directory() . '/inc/template-tags.php';

// ── Custom image sizes ────────────────────────────────────────
add_image_size( 'wonderlyf-product',  600, 600, true );
add_image_size( 'wonderlyf-category', 480, 640, true );
add_image_size( 'wonderlyf-hero',    1920, 1080, true );

// ── CORS for headless React front-end ────────────────────────
// Whitelist of origins allowed to talk to the REST / Store API.
// Add your production + preview domains here.
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
    $allowed = wonderlyf_allowed_origins();
    if ( ! in_array( $origin, $allowed, true ) ) return;

    header( 'Access-Control-Allow-Origin: ' . $origin );
    header( 'Vary: Origin' );
    header( 'Access-Control-Allow-Credentials: true' );
    header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Authorization, Content-Type, Cart-Token, Nonce, X-WP-Nonce' );
    // ‼ Critical for WC Store API cart sessions — browser JS can only read
    // these response headers if they are explicitly exposed.
    header( 'Access-Control-Expose-Headers: Cart-Token, Nonce, X-WP-Nonce, Link' );
}

// Override WP's default REST CORS so we can expose custom headers.
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        wonderlyf_send_cors_headers();
        return $value;
    } );
}, 15 );

// Short-circuit OPTIONS preflight requests with a proper CORS response.
add_action( 'init', function () {
    if ( 'OPTIONS' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) return;
    if ( strpos( $_SERVER['REQUEST_URI'] ?? '', '/wp-json/' ) === false ) return;
    wonderlyf_send_cors_headers();
    status_header( 200 );
    exit;
}, 0 );

// ── Prefill-cart endpoint for headless front-end ─────────────
// Accepts a top-level form POST with a JSON items payload, populates the
// WooCommerce cart in the server-side session, and redirects to checkout.
// Using a form POST (instead of REST/fetch + iframes) means the browser
// treats this as first-party navigation — no CORS, no third-party cookies,
// works even in Safari/Chrome with strict cookie policies.
add_action( 'wp_loaded', function () {
    if ( ( $_POST['wonderlyf_action'] ?? '' ) !== 'prefill_cart' ) return;
    if ( ! function_exists( 'WC' ) || ! WC()->cart ) return;

    // Origin check — only accept POSTs from whitelisted origins.
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    $allowed = wonderlyf_allowed_origins();
    $origin_ok = $origin && in_array( $origin, $allowed, true );
    $referer_ok = false;
    foreach ( $allowed as $a ) {
        if ( $referer && strpos( $referer, $a ) === 0 ) { $referer_ok = true; break; }
    }
    if ( ! $origin_ok && ! $referer_ok ) {
        status_header( 403 );
        exit( 'Origin not allowed' );
    }

    WC()->cart->empty_cart();

    $raw = $_POST['items'] ?? '[]';
    $items = json_decode( wp_unslash( $raw ), true );
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

// Where to send customers after checkout — the React front-end's
// thank-you page. Change this to your production domain when deploying.
if ( ! defined( 'WONDERLYF_FRONTEND_URL' ) ) {
    define( 'WONDERLYF_FRONTEND_URL', 'http://localhost:5173' );
}

// When a customer completes checkout on the WP side (fallback path),
// redirect them back to the React app's order-confirmation page.
add_filter( 'woocommerce_get_return_url', function ( $return_url, $order ) {
    if ( ! $order ) return $return_url;
    return trailingslashit( WONDERLYF_FRONTEND_URL ) . 'order/' . $order->get_id()
        . '?key=' . rawurlencode( $order->get_order_key() );
}, 10, 2 );

// Also cover the thank-you action (covers gateways that bypass get_return_url).
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
    $target = trailingslashit( WONDERLYF_FRONTEND_URL ) . 'order/' . $order_id
        . '?key=' . rawurlencode( $key );
    wp_redirect( $target );
    exit;
}, 5 );

// Exempt the Store / REST API and our prefill endpoint from "Coming Soon"
// mode plugins so the headless front-end can still function.
add_action( 'init', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if ( strpos( $uri, '/wp-json/' ) !== false ) {
        // Tell common coming-soon plugins to skip REST requests.
        add_filter( 'seed_csp4_is_active', '__return_false' );
        add_filter( 'csp_is_coming_soon_active', '__return_false' );
        add_filter( 'cspm_force_disable', '__return_true' );
    }
}, 1 );

// ── Weight-based courier shipping method ─────────────────────
// Register a WooCommerce shipping method that charges by total cart weight
// according to the Wonderlyf UK courier rate card. Activate it in
// WooCommerce → Settings → Shipping → [zone] → Add shipping method →
// "Wonderlyf Courier (Weight Based)".
add_action( 'woocommerce_shipping_init', function () {
    if ( class_exists( 'Wonderlyf_Weight_Shipping' ) ) return;

    class Wonderlyf_Weight_Shipping extends WC_Shipping_Method {
        public function __construct( $instance_id = 0 ) {
            $this->id                 = 'wonderlyf_weight';
            $this->instance_id        = absint( $instance_id );
            $this->method_title       = __( 'Wonderlyf Courier (Weight Based)', 'wonderlyf' );
            $this->method_description = __( 'Weight-based UK courier rates.', 'wonderlyf' );
            $this->supports           = [ 'shipping-zones', 'instance-settings', 'instance-settings-modal' ];
            $this->init();
        }

        public function init() {
            $this->init_form_fields();
            $this->init_settings();
            $this->title              = $this->get_option( 'title', 'Courier Delivery' );
            $this->free_over          = floatval( $this->get_option( 'free_over', 30 ) );

            add_action( 'woocommerce_update_options_shipping_' . $this->id, [ $this, 'process_admin_options' ] );
        }

        public function init_form_fields() {
            $this->instance_form_fields = [
                'title' => [
                    'title'       => 'Method title',
                    'type'        => 'text',
                    'description' => 'Shown to customers at checkout.',
                    'default'     => 'Courier Delivery',
                ],
                'free_over' => [
                    'title'       => 'Free shipping over (£)',
                    'type'        => 'number',
                    'description' => 'Cart subtotal above this amount ships free. 0 to disable.',
                    'default'     => '30',
                ],
            ];
        }

        /** Rate table: [max_weight_kg, cost_gbp] — rows must be ascending. */
        private function rate_table() {
            return [
                [ 0.5,  3.00 ],
                [ 1.0,  3.00 ],
                [ 2.0,  3.50 ],
                [ 2.5,  5.50 ],
                [ 3.0,  5.50 ],
                [ 3.5,  5.50 ],
                [ 4.0,  6.00 ],
                [ 4.5,  6.00 ],
                [ 5.0,  6.00 ],
                [ 5.5,  6.50 ],
                [ 6.0,  6.50 ],
                [ 6.5,  6.50 ],
                [ 7.0,  6.50 ],
                [ 7.5,  7.00 ],
                [ 8.0,  7.00 ],
                [ 8.5,  7.00 ],
                [ 9.0,  7.00 ],
                [ 9.5,  7.00 ],
                [ 10.0, 7.00 ],
                [ 15.0, 10.00 ],
                [ 20.0, 12.00 ],
                [ 25.0, 15.00 ],
            ];
        }

        public function calculate_shipping( $package = [] ) {
            $title = $this->title;

            // Free shipping when cart subtotal exceeds threshold
            if ( $this->free_over > 0 ) {
                $subtotal = 0;
                foreach ( $package['contents'] as $item ) {
                    $subtotal += (float) $item['line_total'];
                }
                if ( $subtotal >= $this->free_over ) {
                    $this->add_rate( [
                        'id'    => $this->id . ':free',
                        'label' => $title . ' — Free',
                        'cost'  => 0,
                    ] );
                    return;
                }
            }

            // Sum cart weight (WC stores weight in the shop's weight unit — assume kg)
            $weight = 0;
            foreach ( $package['contents'] as $item ) {
                $qty = (int) $item['quantity'];
                $w   = (float) $item['data']->get_weight();
                $weight += $w * $qty;
            }

            // Convert from shop weight unit to kg if needed
            $unit = get_option( 'woocommerce_weight_unit' );
            if ( $unit === 'g' )   $weight = $weight / 1000;
            if ( $unit === 'lbs' ) $weight = $weight * 0.453592;
            if ( $unit === 'oz' )  $weight = $weight * 0.0283495;

            $cost = null;
            foreach ( $this->rate_table() as [ $max_kg, $rate ] ) {
                if ( $weight <= $max_kg ) { $cost = $rate; break; }
            }
            // Anything above the top band: use the top band's rate
            if ( $cost === null ) {
                $top  = end( $this->rate_table() );
                $cost = $top[1];
            }

            $this->add_rate( [
                'id'    => $this->id,
                'label' => $title,
                'cost'  => $cost,
            ] );
        }
    }
} );

add_filter( 'woocommerce_shipping_methods', function ( $methods ) {
    $methods['wonderlyf_weight'] = 'Wonderlyf_Weight_Shipping';
    return $methods;
} );

// ── Breadcrumbs ──────────────────────────────────────────────
function wonderlyf_breadcrumb() {
    if ( is_front_page() ) return;
    echo '<nav class="breadcrumb">';
    echo '<a href="' . home_url() . '">Home</a>';
    if ( is_shop() ) {
        echo ' <span>/</span> <span>Shop</span>';
    } elseif ( is_product() ) {
        echo ' <span>/</span> <a href="' . get_permalink( wc_get_page_id('shop') ) . '">Shop</a>';
        echo ' <span>/</span> <span>' . get_the_title() . '</span>';
    } elseif ( is_page() ) {
        echo ' <span>/</span> <span>' . get_the_title() . '</span>';
    }
    echo '</nav>';
}
