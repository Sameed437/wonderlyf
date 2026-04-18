<?php
/**
 * Template tags & helper functions
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Output inline SVG honey icon
 */
function wonderlyf_honey_icon( $size = 24 ) {
    printf(
        '<svg width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 8H20L15.5 12L17.5 18L12 14.5L6.5 18L8.5 12L4 8H9.5L12 2Z" fill="%2$s"/>
        </svg>',
        absint( $size ),
        '#D4940A'
    );
}

/**
 * Output star rating HTML
 */
function wonderlyf_stars( $rating = 5, $max = 5 ) {
    $out = '<span class="testimonial-stars">';
    for ( $i = 1; $i <= $max; $i++ ) {
        $out .= $i <= $rating ? '★' : '☆';
    }
    $out .= '</span>';
    return $out;
}

/**
 * Format price with ₹ symbol
 */
function wonderlyf_price( $amount ) {
    return '₹' . number_format( (float) $amount, 2, '.', ',' );
}

/**
 * Get product category image URL
 */
function wonderlyf_category_image( $cat_id ) {
    $thumbnail_id = get_term_meta( $cat_id, 'thumbnail_id', true );
    if ( $thumbnail_id ) {
        return wp_get_attachment_image_url( $thumbnail_id, 'wonderlyf-category' );
    }
    return get_template_directory_uri() . '/assets/images/category-placeholder.jpg';
}

/**
 * Truncate text to word count
 */
function wonderlyf_excerpt( $text, $words = 20 ) {
    return wp_trim_words( strip_tags( $text ), $words, '…' );
}
