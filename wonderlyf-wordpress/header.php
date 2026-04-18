<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- ── Floating Honey Elements ─────────────────── -->
<div id="floating-elements" aria-hidden="true"></div>

<!-- ── Mobile Nav Overlay ──────────────────────── -->
<div class="mobile-nav-overlay" id="navOverlay"></div>
<nav class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">&#10005;</button>
  <a href="<?php echo home_url('/'); ?>">Home</a>
  <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>">Shop</a>
  <a href="<?php echo home_url('/about'); ?>">About</a>
  <a href="<?php echo home_url('/contact'); ?>">Contact</a>
  <a href="<?php echo wc_get_cart_url(); ?>">Cart
    <?php if ( WC()->cart && WC()->cart->get_cart_contents_count() > 0 ): ?>
      (<?php echo WC()->cart->get_cart_contents_count(); ?>)
    <?php endif; ?>
  </a>
</nav>

<!-- ── Header ──────────────────────────────────── -->
<header id="site-header" class="<?php echo is_front_page() ? 'hero-transparent' : ''; ?>">
  <div class="container">
    <div class="nav-inner">

      <!-- Logo -->
      <a href="<?php echo home_url('/'); ?>" class="site-logo">
        <?php if ( has_custom_logo() ):
          the_custom_logo();
        else: ?>
          <img src="https://wonderlyf.com/wp-content/uploads/2026/01/Logo_Wonderlyf-1.png"
               alt="<?php bloginfo('name'); ?>"
               width="160" height="44"
               loading="eager">
        <?php endif; ?>
      </a>

      <!-- Desktop Nav -->
      <nav class="nav-menu">
        <a href="<?php echo home_url('/'); ?>"
           class="<?php echo is_front_page() ? 'active' : ''; ?>">Home</a>
        <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>"
           class="<?php echo is_shop() || is_product() ? 'active' : ''; ?>">Shop</a>
        <a href="<?php echo home_url('/about'); ?>"
           class="<?php echo is_page('about') ? 'active' : ''; ?>">About</a>
        <a href="<?php echo home_url('/contact'); ?>"
           class="<?php echo is_page('contact') ? 'active' : ''; ?>">Contact</a>
      </nav>

      <!-- Actions -->
      <div class="nav-actions">
        <a href="<?php echo wc_get_cart_url(); ?>" class="nav-cart-btn" aria-label="Cart">
          🛒
          <span class="cart-count"><?php echo WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?></span>
        </a>
        <button class="hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>
  </div>
</header>

<!-- ── Marquee Bar ─────────────────────────────── -->
<?php if ( is_front_page() ): ?>
<div class="marquee-bar" style="margin-top:0; position:relative; z-index:11;">
  <div class="marquee-track" id="marqueeTrack">
    <?php
    $items = ['100% Natural', 'Traditional Recipes', 'No Preservatives', 'Made with Love', 'Forest Honey', 'Handcrafted', 'Shipped Across India', 'Trusted by Families', '100% Natural', 'Traditional Recipes', 'No Preservatives', 'Made with Love', 'Forest Honey', 'Handcrafted', 'Shipped Across India', 'Trusted by Families'];
    foreach ($items as $item):
    ?>
      <span class="marquee-item">
        <span class="marquee-dot"></span>
        <?php echo esc_html($item); ?>
      </span>
    <?php endforeach; ?>
  </div>
</div>
<?php endif; ?>
