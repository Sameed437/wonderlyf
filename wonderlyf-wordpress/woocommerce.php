<?php get_header(); ?>

<div class="shop-content">
  <div class="container">
    <?php do_action( 'woocommerce_before_main_content' ); ?>

    <div class="shop-layout">

      <!-- Sidebar -->
      <aside class="shop-sidebar">
        <?php if ( is_active_sidebar( 'shop-sidebar' ) ): ?>
          <?php dynamic_sidebar( 'shop-sidebar' ); ?>
        <?php else: ?>
          <!-- Default sidebar when no widgets added -->
          <div class="sidebar-widget">
            <h3 class="sidebar-title">Categories</h3>
            <div class="sidebar-category-list">
              <?php
              $cats = get_terms(['taxonomy'=>'product_cat','hide_empty'=>false]);
              if (!is_wp_error($cats)) foreach ($cats as $cat):
                if ($cat->name === 'Uncategorized') continue;
              ?>
              <a href="<?php echo get_term_link($cat); ?>"
                 class="<?php echo (is_product_category($cat->slug)) ? 'active' : ''; ?>">
                <?php echo esc_html($cat->name); ?>
                <span style="color:var(--warm-light); font-size:12px;"><?php echo $cat->count; ?></span>
              </a>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>
      </aside>

      <!-- Main content -->
      <main>
        <!-- Shop page heading -->
        <?php if ( is_shop() && !is_search() ): ?>
        <div style="margin-bottom: 40px; padding: 40px 0 0;">
          <div class="section-heading" style="text-align:left; margin-bottom:32px;">
            <span class="section-subtitle">All Products</span>
            <h1 class="section-title">Our <span class="honey-text">Collection</span></h1>
          </div>
        </div>
        <?php endif; ?>

        <?php woocommerce_content(); ?>
      </main>

    </div>

    <?php do_action( 'woocommerce_after_main_content' ); ?>
  </div>
</div>

<?php get_footer(); ?>
