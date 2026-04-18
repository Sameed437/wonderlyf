<?php
/**
 * Wonderlyf Performance Optimizations
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Remove bloat from <head> ──────────────────────────────────
remove_action( 'wp_head', 'wp_generator' );              // Hide WP version
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'feed_links_extra', 3 );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// ── Disable XML-RPC ──────────────────────────────────────────
add_filter( 'xmlrpc_enabled', '__return_false' );

// ── Disable WP Heartbeat on front-end ────────────────────────
add_action( 'init', function() {
    if ( ! is_admin() ) {
        wp_deregister_script( 'heartbeat' );
    }
});

// ── Add preload hints for critical resources ──────────────────
add_action( 'wp_head', function() {
    echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">' . "\n";
    echo '<link rel="dns-prefetch" href="//wonderlyf.com">' . "\n";
}, 1 );

// ── Lazy load all images by default ──────────────────────────
add_filter( 'wp_lazy_loading_enabled', '__return_true' );

// ── Cache-Control headers for static assets ──────────────────
add_action( 'send_headers', function() {
    if ( ! is_admin() ) {
        header( 'Cache-Control: public, max-age=31536000, immutable', false );
    }
});

// ── Disable unnecessary WooCommerce scripts ───────────────────
add_action( 'wp_enqueue_scripts', function() {
    // Only load WooCommerce scripts on relevant pages
    if ( ! is_woocommerce() && ! is_cart() && ! is_checkout() && ! is_account_page() ) {
        wp_dequeue_style( 'woocommerce-layout' );
        wp_dequeue_style( 'woocommerce-general' );
        wp_dequeue_style( 'woocommerce-smallscreen' );
    }
}, 99 );

// ── Defer non-critical scripts ────────────────────────────────
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
    $defer = [ 'wonderlyf-main' ];
    if ( in_array( $handle, $defer ) ) {
        return str_replace( ' src', ' defer src', $tag );
    }
    return $tag;
}, 10, 3 );
