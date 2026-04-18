<?php
/**
 * Archive product — wrapped by woocommerce.php
 * This file is the loop WooCommerce uses for the shop page.
 */
defined( 'ABSPATH' ) || exit;
?>

<?php do_action( 'woocommerce_before_shop_loop' ); ?>

<?php if ( woocommerce_product_loop() ) : ?>

  <!-- Results count + ordering -->
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px;">
    <?php woocommerce_result_count(); ?>
    <?php woocommerce_catalog_ordering(); ?>
  </div>

  <div class="products-grid">
    <?php while ( have_posts() ) : ?>
      <?php the_post(); ?>
      <?php global $product; ?>

      <?php
      $img      = get_the_post_thumbnail_url( get_the_ID(), 'wonderlyf-product' );
      $price    = $product->get_price_html();
      $cats     = wp_get_post_terms( get_the_ID(), 'product_cat' );
      $cat_name = ! empty( $cats ) ? $cats[0]->name : '';
      $in_stock = $product->is_in_stock();
      ?>

      <div class="product-card reveal">
        <a href="<?php the_permalink(); ?>" style="text-decoration:none;">
          <div class="product-card-image">
            <?php if ( $img ) : ?>
              <img src="<?php echo esc_url( $img ); ?>"
                   alt="<?php the_title_attribute(); ?>"
                   loading="lazy">
            <?php else : ?>
              <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:60px;background:var(--cream);">🍯</div>
            <?php endif; ?>
            <?php if ( $product->is_on_sale() ) : ?>
              <span class="product-badge">Sale</span>
            <?php endif; ?>
            <?php if ( ! $in_stock ) : ?>
              <span class="product-badge" style="background:var(--warm-light);">Sold Out</span>
            <?php endif; ?>
          </div>
          <div class="product-card-body">
            <?php if ( $cat_name ) : ?>
              <p class="product-category"><?php echo esc_html( $cat_name ); ?></p>
            <?php endif; ?>
            <h3 class="product-name"><?php the_title(); ?></h3>
            <p class="product-desc"><?php echo wp_trim_words( get_the_excerpt(), 12, '…' ); ?></p>
            <div class="product-footer">
              <span class="product-price"><?php echo $price; ?></span>
              <?php if ( $in_stock ) : ?>
                <button class="product-add-btn js-add-to-cart"
                        data-product-id="<?php echo get_the_ID(); ?>"
                        aria-label="Add <?php the_title_attribute(); ?> to cart"
                        onclick="event.preventDefault(); event.stopPropagation();">
                  Add to Cart
                </button>
              <?php else : ?>
                <span style="font-size:12px; color:var(--warm-light);">Out of Stock</span>
              <?php endif; ?>
            </div>
          </div>
        </a>
      </div>

    <?php endwhile; ?>
  </div>

  <?php do_action( 'woocommerce_after_shop_loop' ); ?>

  <!-- Pagination -->
  <div style="margin-top:48px; display:flex; justify-content:center;">
    <?php woocommerce_pagination(); ?>
  </div>

<?php else : ?>
  <div style="text-align:center; padding:80px 0;">
    <div style="font-size:64px; margin-bottom:20px;">🍯</div>
    <h3 style="font-family:'Playfair Display',serif; font-size:28px; color:var(--warm-brown); margin-bottom:12px;">
      No products found
    </h3>
    <p style="color:var(--warm-light); margin-bottom:32px;">Try browsing all categories or check back soon.</p>
    <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-primary">
      View All Products →
    </a>
  </div>
<?php endif; ?>
