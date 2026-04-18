<?php
/**
 * Single Product — Wonderlyf override
 */
get_header();
while ( have_posts() ) :
    the_post();
    global $product;

    $gallery_ids  = $product->get_gallery_image_ids();
    $main_img     = get_the_post_thumbnail_url( get_the_ID(), 'wonderlyf-product' );
    $price        = $product->get_price_html();
    $reg_price    = $product->get_regular_price();
    $sale_price   = $product->get_sale_price();
    $description  = $product->get_description() ?: $product->get_short_description();
    $short_desc   = $product->get_short_description();
    $cats         = wp_get_post_terms( get_the_ID(), 'product_cat' );
    $cat_name     = !empty($cats) ? $cats[0]->name : '';
    $in_stock     = $product->is_in_stock();
    $rating       = $product->get_average_rating();
    $review_count = $product->get_review_count();
?>

<div style="background: var(--cream); padding-bottom: 100px;">
  <div class="container">

    <!-- Breadcrumb -->
    <nav style="padding: 130px 0 0; font-size:13px; color:var(--warm-light);">
      <a href="<?php echo home_url('/'); ?>" style="color:var(--warm-light);">Home</a>
      <span style="margin:0 8px; color:var(--honey);">/</span>
      <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" style="color:var(--warm-light);">Shop</a>
      <?php if ($cat_name): ?>
      <span style="margin:0 8px; color:var(--honey);">/</span>
      <span><?php echo esc_html($cat_name); ?></span>
      <?php endif; ?>
      <span style="margin:0 8px; color:var(--honey);">/</span>
      <span style="color:var(--warm-brown); font-weight:600;"><?php the_title(); ?></span>
    </nav>

    <!-- Product layout -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; margin-top:40px;"
         class="single-product-grid">

      <!-- LEFT: Gallery -->
      <div class="reveal">
        <!-- Main image -->
        <div style="
          background:#fff;
          border-radius:24px;
          padding:32px;
          border:1px solid rgba(212,148,10,0.1);
          box-shadow: 0 4px 20px rgba(212,148,10,0.08);
          margin-bottom:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          min-height:400px;
        " id="mainProductImage">
          <?php if ($main_img): ?>
          <img src="<?php echo esc_url($main_img); ?>"
               alt="<?php the_title_attribute(); ?>"
               style="max-height:380px; width:auto; max-width:100%; object-fit:contain;"
               id="mainImg">
          <?php else: ?>
          <div style="font-size:80px;">🍯</div>
          <?php endif; ?>
        </div>

        <!-- Thumbnail gallery -->
        <?php if (!empty($gallery_ids)): ?>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <?php
          // Show main image thumb first
          if ($main_img):
          ?>
          <div onclick="document.getElementById('mainImg').src='<?php echo esc_url($main_img); ?>'"
               style="width:72px;height:72px;border-radius:12px;overflow:hidden;border:2px solid var(--honey);cursor:pointer;background:#fff;padding:4px;">
            <img src="<?php echo esc_url($main_img); ?>" style="width:100%;height:100%;object-fit:contain;" alt="">
          </div>
          <?php endif; ?>
          <?php foreach ($gallery_ids as $gid):
            $gurl = wp_get_attachment_image_url($gid, 'wonderlyf-product');
            if (!$gurl) continue;
          ?>
          <div onclick="document.getElementById('mainImg').src='<?php echo esc_url($gurl); ?>'"
               style="width:72px;height:72px;border-radius:12px;overflow:hidden;border:1.5px solid rgba(212,148,10,0.2);cursor:pointer;background:#fff;padding:4px;transition:border-color .2s;"
               onmouseover="this.style.borderColor='var(--honey)'" onmouseout="this.style.borderColor='rgba(212,148,10,0.2)'">
            <img src="<?php echo esc_url($gurl); ?>" style="width:100%;height:100%;object-fit:contain;" alt="" loading="lazy">
          </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>

      <!-- RIGHT: Product Info -->
      <div class="reveal reveal-delay-2">

        <!-- Category + stock -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <?php if ($cat_name): ?>
          <span class="section-subtitle" style="display:inline-block;"><?php echo esc_html($cat_name); ?></span>
          <?php endif; ?>
          <span style="
            font-size:12px; font-weight:600; padding:4px 12px; border-radius:999px;
            background:<?php echo $in_stock ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)'; ?>;
            color:<?php echo $in_stock ? '#2E7D32' : '#C62828'; ?>;
            border:1px solid <?php echo $in_stock ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)'; ?>;
          ">
            <?php echo $in_stock ? '✓ In Stock' : '✗ Out of Stock'; ?>
          </span>
        </div>

        <!-- Title -->
        <h1 style="
          font-family:'Playfair Display',serif;
          font-size:clamp(28px,3.5vw,42px);
          font-weight:800;
          color:var(--warm-brown);
          margin-bottom:16px;
          line-height:1.2;
        "><?php the_title(); ?></h1>

        <!-- Rating -->
        <?php if ($rating > 0): ?>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
          <span style="color:var(--honey-light); font-size:18px;"><?php echo str_repeat('★', round($rating)); ?></span>
          <span style="font-size:14px; color:var(--warm-light);"><?php echo $rating; ?> (<?php echo $review_count; ?> reviews)</span>
        </div>
        <?php endif; ?>

        <!-- Price -->
        <div style="margin-bottom:24px;">
          <?php if ($sale_price && $reg_price): ?>
          <span style="font-size:15px; color:var(--warm-light); text-decoration:line-through; margin-right:10px;">
            ₹<?php echo esc_html($reg_price); ?>
          </span>
          <span style="font-size:36px; font-weight:800; color:var(--honey-dark);">
            ₹<?php echo esc_html($sale_price); ?>
          </span>
          <span style="
            margin-left:10px; background:rgba(212,148,10,0.1); color:var(--honey-dark);
            border:1px solid rgba(212,148,10,0.2); border-radius:999px;
            padding:3px 10px; font-size:12px; font-weight:700;
          ">
            <?php echo round((($reg_price - $sale_price) / $reg_price) * 100); ?>% OFF
          </span>
          <?php else: ?>
          <span style="font-size:36px; font-weight:800; color:var(--honey-dark);">
            <?php echo $price; ?>
          </span>
          <?php endif; ?>
        </div>

        <!-- Short description -->
        <?php if ($short_desc): ?>
        <p style="font-size:15px; color:var(--warm-light); line-height:1.8; margin-bottom:24px; border-left:3px solid var(--honey); padding-left:16px;">
          <?php echo wp_kses_post($short_desc); ?>
        </p>
        <?php endif; ?>

        <!-- Add to cart form -->
        <?php if ($in_stock): ?>
        <form class="cart" method="post" enctype="multipart/form-data" style="margin-bottom:24px;">
          <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
            <!-- Quantity -->
            <div style="display:flex; align-items:center; border:1.5px solid rgba(212,148,10,0.25); border-radius:999px; overflow:hidden;">
              <button type="button"
                onclick="let q=document.getElementById('qty'); if(q.value>1) q.value=parseInt(q.value)-1;"
                style="width:42px;height:42px;background:none;border:none;cursor:pointer;font-size:18px;color:var(--warm-brown);">−</button>
              <input type="number" id="qty" name="quantity" value="1" min="1" max="99"
                style="width:48px;text-align:center;border:none;font-size:16px;font-weight:700;color:var(--warm-brown);background:transparent;outline:none;">
              <button type="button"
                onclick="let q=document.getElementById('qty'); q.value=parseInt(q.value)+1;"
                style="width:42px;height:42px;background:none;border:none;cursor:pointer;font-size:18px;color:var(--warm-brown);">+</button>
            </div>
            <!-- Add to cart -->
            <button type="submit" name="add-to-cart" value="<?php echo get_the_ID(); ?>"
              class="btn btn-primary js-add-to-cart"
              data-product-id="<?php echo get_the_ID(); ?>"
              style="flex:1; justify-content:center; font-size:16px; padding:14px 28px;">
              🛒 Add to Cart
            </button>
          </div>
          <!-- Buy now -->
          <a href="<?php echo wc_get_checkout_url() . '?add-to-cart=' . get_the_ID(); ?>"
             class="btn btn-ghost" style="width:100%; justify-content:center;">
            Buy Now →
          </a>
        </form>
        <?php else: ?>
        <button class="btn" style="width:100%;justify-content:center;background:var(--cream-deeper);color:var(--warm-light);cursor:not-allowed;" disabled>
          Out of Stock
        </button>
        <?php endif; ?>

        <!-- Trust badges -->
        <div style="
          display:grid; grid-template-columns:repeat(3,1fr); gap:12px;
          margin-top:28px;
          padding:20px;
          background:var(--cream);
          border-radius:16px;
          border:1px solid rgba(212,148,10,0.1);
        ">
          <div style="text-align:center;">
            <div style="font-size:22px; margin-bottom:4px;">🚚</div>
            <div style="font-size:11px; color:var(--warm-light); line-height:1.4;">Free shipping<br>above ₹499</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:22px; margin-bottom:4px;">🔒</div>
            <div style="font-size:11px; color:var(--warm-light); line-height:1.4;">Secure<br>payment</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:22px; margin-bottom:4px;">↩️</div>
            <div style="font-size:11px; color:var(--warm-light); line-height:1.4;">Easy<br>returns</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabs: Description / Reviews -->
    <div style="margin-top:80px;" class="reveal">
      <div style="display:flex; gap:0; border-bottom:2px solid rgba(212,148,10,0.1); margin-bottom:40px;" id="productTabs">
        <button onclick="showTab('desc')" id="tab-desc"
          style="padding:14px 32px; background:none; border:none; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; color:var(--honey); cursor:pointer; border-bottom:3px solid var(--honey); margin-bottom:-2px;">
          Description
        </button>
        <button onclick="showTab('reviews')" id="tab-reviews"
          style="padding:14px 32px; background:none; border:none; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; color:var(--warm-light); cursor:pointer; border-bottom:3px solid transparent; margin-bottom:-2px;">
          Reviews (<?php echo $review_count; ?>)
        </button>
      </div>

      <div id="tab-desc-content" style="display:block;">
        <div style="
          background:#fff; border-radius:20px; padding:40px;
          border:1px solid rgba(212,148,10,0.1);
          box-shadow:0 4px 20px rgba(212,148,10,0.08);
          line-height:1.9; font-size:16px; color:var(--warm-gray);
        ">
          <?php echo wp_kses_post( $description ?: '<p>Pure, natural, and handcrafted with care.</p>' ); ?>
        </div>
      </div>

      <div id="tab-reviews-content" style="display:none;">
        <div style="background:#fff; border-radius:20px; padding:40px; border:1px solid rgba(212,148,10,0.1);">
          <?php
          // WooCommerce reviews
          if ( comments_open() ) {
            comments_template();
          } else {
            echo '<p style="color:var(--warm-light);">Reviews are closed for this product.</p>';
          }
          ?>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <?php
    $related = wc_get_related_products( get_the_ID(), 4 );
    if ( !empty($related) ) :
    ?>
    <div style="margin-top:80px;" class="reveal">
      <div class="section-heading" style="text-align:left; margin-bottom:36px;">
        <span class="section-subtitle">You May Also Like</span>
        <h2 class="section-title" style="text-align:left;">Related <span class="honey-text">Products</span></h2>
      </div>
      <div class="products-grid" style="grid-template-columns:repeat(4,1fr);">
        <?php foreach ($related as $related_id):
          $r = wc_get_product($related_id);
          if (!$r) continue;
          $r_img = get_the_post_thumbnail_url($related_id, 'wonderlyf-product');
        ?>
        <div class="product-card">
          <a href="<?php echo get_permalink($related_id); ?>">
            <div class="product-card-image">
              <?php if ($r_img): ?>
              <img src="<?php echo esc_url($r_img); ?>" alt="<?php echo esc_attr($r->get_name()); ?>" loading="lazy">
              <?php endif; ?>
            </div>
            <div class="product-card-body">
              <h3 class="product-name" style="font-size:15px;"><?php echo esc_html($r->get_name()); ?></h3>
              <div class="product-footer">
                <span class="product-price" style="font-size:16px;"><?php echo $r->get_price_html(); ?></span>
                <button class="product-add-btn js-add-to-cart" data-product-id="<?php echo $related_id; ?>" style="font-size:12px; padding:8px 14px;">Add</button>
              </div>
            </div>
          </a>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

  </div>
</div>

<script>
function showTab(name) {
  document.getElementById('tab-desc-content').style.display   = (name==='desc')    ? 'block' : 'none';
  document.getElementById('tab-reviews-content').style.display = (name==='reviews') ? 'block' : 'none';
  document.getElementById('tab-desc').style.color            = (name==='desc')    ? 'var(--honey)'      : 'var(--warm-light)';
  document.getElementById('tab-reviews').style.color         = (name==='reviews') ? 'var(--honey)'      : 'var(--warm-light)';
  document.getElementById('tab-desc').style.borderBottomColor    = (name==='desc')    ? 'var(--honey)' : 'transparent';
  document.getElementById('tab-reviews').style.borderBottomColor = (name==='reviews') ? 'var(--honey)' : 'transparent';
}
</script>

<?php
endwhile;
get_footer();
?>
