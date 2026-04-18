<?php get_header(); ?>

<!-- ══════════════════════════════════════════════════════
     HERO — Full-screen Video
════════════════════════════════════════════════════════ -->
<section class="hero-section">
  <div class="hero-video-wrap">
    <video autoplay muted loop playsinline preload="auto"
           poster="https://wonderlyf.com/wp-content/uploads/2026/02/About-US_Wonderlyf.jpg">
      <source src="<?php echo get_template_directory_uri(); ?>/assets/videos/honey-hero.mp4" type="video/mp4">
    </video>
    <div class="hero-overlay"></div>
    <div class="hero-fade-bottom"></div>
  </div>

  <div class="hero-content">
    <p class="hero-pre">Crafting Authentic, Nutritious Food</p>
    <h1 class="hero-title">
      Bring Wonders<br>
      <span>to your Life</span>
    </h1>
    <p class="hero-desc">Traditional wellness products rooted in ancient wisdom. Pure. Natural. Homemade.</p>
    <div class="hero-btns">
      <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-primary">
        Shop Now →
      </a>
      <a href="<?php echo home_url('/about'); ?>" class="btn btn-outline">
        Our Story
      </a>
    </div>
  </div>

  <div class="scroll-indicator">
    <div class="scroll-mouse">
      <div class="scroll-dot"></div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     FLOATING PRODUCTS
════════════════════════════════════════════════════════ -->
<section class="hero-products-section">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Our Range</span>
      <h2 class="section-title">Products Made with <span class="honey-text">Love</span></h2>
      <p class="section-desc">Explore our handcrafted collection of traditional wellness products.</p>
    </div>

    <div class="hero-products-grid">
      <div class="hero-products-ring"></div>
      <div class="products-badge">
        <span class="badge-num"><?php echo wp_count_posts('product')->publish; ?>+</span>
        <span class="badge-txt">Products</span>
      </div>

      <?php
      // Floating product positions
      $float_products = [
        ['name' => 'Forest Honey',      'img' => 'https://wonderlyf.com/wp-content/uploads/2025/12/Forest-Honey-300x300.png',    'x' => '50%',  'y' => '45%',  'size' => 140],
        ['name' => 'Kambu Ladoo',       'img' => 'https://wonderlyf.com/wp-content/uploads/2026/03/01-300x300.png',               'x' => '15%',  'y' => '20%',  'size' => 100],
        ['name' => 'Keshkalpa',         'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/01-2-300x300.png',             'x' => '78%',  'y' => '18%',  'size' => 110],
        ['name' => 'Moringa Relish',    'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-1-300x300.png',            'x' => '20%',  'y' => '72%',  'size' => 90],
        ['name' => 'Paruthipal Mix',    'img' => 'https://wonderlyf.com/wp-content/uploads/2025/12/Paruthipal-Mix-2-300x300.png', 'x' => '75%',  'y' => '70%',  'size' => 85],
        ['name' => 'Banana Stem Soup',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-300x300.png',              'x' => '48%',  'y' => '85%',  'size' => 75],
      ];

      foreach ($float_products as $i => $p):
        $delay = $i * 0.5;
      ?>
      <div class="hero-product-item"
           style="left:<?php echo $p['x']; ?>; top:<?php echo $p['y']; ?>; animation-delay:-<?php echo $delay; ?>s;">
        <img src="<?php echo esc_url($p['img']); ?>"
             alt="<?php echo esc_attr($p['name']); ?>"
             width="<?php echo $p['size']; ?>" height="<?php echo $p['size']; ?>"
             loading="<?php echo $i < 2 ? 'eager' : 'lazy'; ?>">
        <span class="hero-product-label"><?php echo esc_html($p['name']); ?></span>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     STATS BAR
════════════════════════════════════════════════════════ -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <?php
      $stats = [
        ['value' => '19',  'suffix' => '+', 'label' => 'Products'],
        ['value' => '500', 'suffix' => '+', 'label' => 'Happy Customers'],
        ['value' => '4.9', 'suffix' => '★', 'label' => 'Average Rating'],
        ['value' => '100', 'suffix' => '%', 'label' => 'Natural Ingredients'],
      ];
      foreach ($stats as $i => $s):
      ?>
      <div class="stat-item reveal reveal-delay-<?php echo $i+1; ?>">
        <div class="stat-num" data-target="<?php echo $s['value']; ?>" data-suffix="<?php echo $s['suffix']; ?>">
          0<?php echo $s['suffix']; ?>
        </div>
        <div class="stat-label"><?php echo $s['label']; ?></div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     CATEGORY CAROUSEL
════════════════════════════════════════════════════════ -->
<section class="categories-section">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Browse Categories</span>
      <h2 class="section-title">Explore Our <span class="honey-text">Range</span></h2>
      <p class="section-desc">From healing soups to grandma's crunchy treats, discover wellness in every category.</p>
    </div>

    <div style="position:relative;">
      <button class="carousel-btn carousel-btn-prev" aria-label="Previous">&#8592;</button>
      <div class="category-carousel-wrap">
        <div class="category-track">
          <?php
          $categories = [
            ['name' => 'Honey',         'count' => '2 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2025/12/Forest-Honey-300x300.png'],
            ['name' => 'Ladoo & Sweets','count' => '3 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/03/01-300x300.png'],
            ['name' => 'Soup Mixes',    'count' => '3 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-300x300.png'],
            ['name' => 'Hair Care',     'count' => '2 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/01-2-300x300.png'],
            ['name' => 'Relish',        'count' => '3 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-1-300x300.png'],
            ['name' => 'Dal & Grains',  'count' => '3 products',  'img' => 'https://wonderlyf.com/wp-content/uploads/2026/01/Toor-Dal-01-300x300.png'],
          ];

          // OR use WooCommerce product categories if available:
          $woo_cats = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false, 'exclude' => [get_option('default_product_cat')]]);

          if (!is_wp_error($woo_cats) && !empty($woo_cats)) {
            foreach (array_slice($woo_cats, 0, 6) as $cat):
              $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
              $img = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'wonderlyf-category') : '';
              if (!$img) $img = 'https://wonderlyf.com/wp-content/uploads/2026/02/About-US_Wonderlyf.jpg';
          ?>
          <div class="category-card">
            <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($cat->name); ?>" loading="lazy">
            <div class="category-card-overlay"></div>
            <div class="category-card-content">
              <div class="category-card-name"><?php echo esc_html($cat->name); ?></div>
              <div class="category-card-count"><?php echo $cat->count; ?> products</div>
            </div>
          </div>
          <?php endforeach;
          } else {
            // Fallback static
            foreach ($categories as $cat):
          ?>
          <div class="category-card">
            <img src="<?php echo esc_url($cat['img']); ?>" alt="<?php echo esc_attr($cat['name']); ?>" loading="lazy">
            <div class="category-card-overlay"></div>
            <div class="category-card-content">
              <div class="category-card-name"><?php echo esc_html($cat['name']); ?></div>
              <div class="category-card-count"><?php echo esc_html($cat['count']); ?></div>
            </div>
          </div>
          <?php endforeach; } ?>
        </div>
      </div>
      <button class="carousel-btn carousel-btn-next" aria-label="Next">&#8594;</button>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     FEATURED PRODUCTS
════════════════════════════════════════════════════════ -->
<section class="products-section" style="background:#fff;">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Featured Products</span>
      <h2 class="section-title">Crafted with <span class="honey-text">Care</span></h2>
      <p class="section-desc">Our most loved products, handpicked from across our collection.</p>
    </div>

    <div class="products-grid">
      <?php
      $featured = new WP_Query([
        'post_type'      => 'product',
        'posts_per_page' => 6,
        'meta_query'     => [['key' => '_featured', 'value' => 'yes']],
        'orderby'        => 'date',
        'order'          => 'DESC',
      ]);

      // fallback: just get latest 6
      if (!$featured->have_posts()) {
        $featured = new WP_Query([
          'post_type'      => 'product',
          'posts_per_page' => 6,
          'orderby'        => 'date',
          'order'          => 'DESC',
        ]);
      }

      if ($featured->have_posts()):
        $delay = 0;
        while ($featured->have_posts()): $featured->the_post();
          global $product;
          $img     = get_the_post_thumbnail_url(get_the_ID(), 'wonderlyf-product');
          $price   = $product->get_price_html();
          $cats    = wp_get_post_terms(get_the_ID(), 'product_cat');
          $cat_name = !empty($cats) ? $cats[0]->name : '';
          $delay++;
      ?>
      <div class="product-card reveal reveal-delay-<?php echo min($delay, 5); ?>">
        <a href="<?php the_permalink(); ?>">
          <div class="product-card-image">
            <?php if ($img): ?>
              <img src="<?php echo esc_url($img); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
            <?php else: ?>
              <img src="https://wonderlyf.com/wp-content/uploads/2025/12/Forest-Honey-300x300.png" alt="<?php the_title_attribute(); ?>" loading="lazy">
            <?php endif; ?>
            <?php if ($product->is_on_sale()): ?>
              <span class="product-badge">Sale</span>
            <?php endif; ?>
          </div>
          <div class="product-card-body">
            <?php if ($cat_name): ?><p class="product-category"><?php echo esc_html($cat_name); ?></p><?php endif; ?>
            <h3 class="product-name"><?php the_title(); ?></h3>
            <p class="product-desc"><?php echo wp_trim_words(get_the_excerpt(), 12); ?></p>
            <div class="product-footer">
              <span class="product-price"><?php echo $price; ?></span>
              <button class="product-add-btn js-add-to-cart"
                      data-product-id="<?php echo get_the_ID(); ?>"
                      aria-label="Add <?php the_title_attribute(); ?> to cart">
                Add to Cart
              </button>
            </div>
          </div>
        </a>
      </div>
      <?php
        endwhile;
        wp_reset_postdata();
      else:
        // Static fallback when no WooCommerce products yet
        $static = [
          ['name'=>'Toor Dal',         'cat'=>'Dal & Grains',  'price'=>'₹120', 'img'=>'https://wonderlyf.com/wp-content/uploads/2026/01/Toor-Dal-01-300x300.png'],
          ['name'=>'Kambu Ladoo',      'cat'=>'Ladoo',         'price'=>'₹199', 'img'=>'https://wonderlyf.com/wp-content/uploads/2026/03/01-300x300.png'],
          ['name'=>'Forest Honey',     'cat'=>'Honey',         'price'=>'₹450', 'img'=>'https://wonderlyf.com/wp-content/uploads/2025/12/Forest-Honey-300x300.png'],
          ['name'=>'Moringa Relish',   'cat'=>'Relish',        'price'=>'₹179', 'img'=>'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-1-300x300.png'],
          ['name'=>'Keshkalpa',        'cat'=>'Hair Care',     'price'=>'₹349', 'img'=>'https://wonderlyf.com/wp-content/uploads/2026/02/01-2-300x300.png'],
          ['name'=>'Banana Stem Soup', 'cat'=>'Soup Mix',      'price'=>'₹159', 'img'=>'https://wonderlyf.com/wp-content/uploads/2026/02/PNG-300x300.png'],
        ];
        foreach ($static as $i => $p):
      ?>
      <div class="product-card reveal reveal-delay-<?php echo $i+1; ?>">
        <div class="product-card-image">
          <img src="<?php echo esc_url($p['img']); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy">
        </div>
        <div class="product-card-body">
          <p class="product-category"><?php echo esc_html($p['cat']); ?></p>
          <h3 class="product-name"><?php echo esc_html($p['name']); ?></h3>
          <div class="product-footer">
            <span class="product-price"><?php echo esc_html($p['price']); ?></span>
            <a href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" class="product-add-btn">View</a>
          </div>
        </div>
      </div>
      <?php
        endforeach;
      endif;
      ?>
    </div>

    <div class="text-center" style="margin-top:48px;">
      <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-ghost">
        View All Products →
      </a>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     OUR PROCESS (Timeline)
════════════════════════════════════════════════════════ -->
<section class="process-section">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Our Process</span>
      <h2 class="section-title">From Our <span class="honey-text">Kitchen</span></h2>
      <p class="section-desc">Every product follows a journey from nature to your doorstep, preserving purity at every step.</p>
    </div>

    <div class="process-timeline">
      <div class="process-line"></div>

      <?php
      $steps = [
        ['step'=>1,'title'=>'Sourcing from Nature',     'sub'=>'Direct from forests & farms',      'desc'=>'We partner directly with forest tribes and local farmers in Tamil Nadu to source the purest ingredients — wild honey, organic herbs, and traditional grains.'],
        ['step'=>2,'title'=>'Traditional Preparation',  'sub'=>'Ancient recipes, no shortcuts',    'desc'=>'Our products are prepared using age-old recipes passed down through generations. No artificial additives, no preservatives — just pure, wholesome goodness.'],
        ['step'=>3,'title'=>'Quality Inspection',       'sub'=>'Every batch tested with care',     'desc'=>'Before packaging, every batch goes through rigorous quality checks for purity, taste, and nutritional value to ensure it meets our premium standards.'],
        ['step'=>4,'title'=>'Handcrafted Packaging',    'sub'=>'Sealed to preserve freshness',     'desc'=>'Each product is carefully packed to preserve its natural properties and freshness, ensuring it reaches you exactly as nature intended.'],
        ['step'=>5,'title'=>'Delivered to Your Door',   'sub'=>'Fast & safe across India',         'desc'=>'From our kitchen to your doorstep, we ensure your order is shipped swiftly and safely so you can enjoy the wonders of nature without delay.'],
      ];
      foreach ($steps as $step):
      ?>
      <div class="process-step">
        <div class="process-dot"><?php echo $step['step']; ?></div>
        <div class="process-content">
          <p class="process-step-label">Step <?php echo $step['step']; ?> of 5</p>
          <h3 class="process-step-title"><?php echo esc_html($step['title']); ?></h3>
          <p class="process-step-subtitle"><?php echo esc_html($step['sub']); ?></p>
          <p class="process-step-desc"><?php echo esc_html($step['desc']); ?></p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     ABOUT SECTION
════════════════════════════════════════════════════════ -->
<section class="about-section">
  <div class="container">
    <div class="about-grid">
      <div class="about-image reveal">
        <img src="https://wonderlyf.com/wp-content/uploads/2026/02/About-US_Wonderlyf.jpg"
             alt="About Wonderlyf" loading="lazy">
      </div>
      <div class="about-content reveal reveal-delay-2">
        <span class="section-subtitle">About Us</span>
        <h2 class="about-title">Purity, Warmth &amp; Wonders of Home</h2>
        <p class="about-desc">
          Wonderlyf is dedicated to crafting authentic, nutritious food products rooted in traditional wisdom.
          Born from a passion for preserving time-honored recipes and promoting holistic well-being, Wonderlyf
          brings you the purity, warmth, and wonders of home.
        </p>
        <a href="<?php echo home_url('/about'); ?>" class="btn btn-primary">
          Discover Our Story →
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     WHY CHOOSE US
════════════════════════════════════════════════════════ -->
<section class="why-section">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Why Wonderlyf</span>
      <h2 class="section-title">Why <span class="honey-text">Choose Us</span></h2>
      <p class="section-desc">What makes Wonderlyf different from the rest.</p>
    </div>

    <div class="why-grid">
      <?php
      $reasons = [
        ['icon'=>'🌿','title'=>'100% Natural',         'desc'=>'No artificial colours, flavours or preservatives. Every ingredient is sourced from nature.'],
        ['icon'=>'🏺','title'=>'Traditional Recipes',  'desc'=>'Ancient recipes passed down through generations, prepared exactly as your grandmother would.'],
        ['icon'=>'🐝','title'=>'Pure Forest Honey',    'desc'=>'Raw, unfiltered honey harvested directly from forest trees by tribal communities.'],
        ['icon'=>'🚚','title'=>'Fast Pan-India Delivery','desc'=>'Quick and reliable shipping across India so you never have to wait for your wellness.'],
        ['icon'=>'❤️','title'=>'Made with Love',       'desc'=>'Small-batch, handcrafted with attention to quality and care for your health.'],
        ['icon'=>'🛡️','title'=>'Quality Assured',     'desc'=>'Every batch is tested and quality-checked before it reaches your hands.'],
      ];
      foreach ($reasons as $i => $r):
      ?>
      <div class="why-card reveal reveal-delay-<?php echo ($i % 3) + 1; ?>">
        <span class="why-icon"><?php echo $r['icon']; ?></span>
        <h3 class="why-title"><?php echo esc_html($r['title']); ?></h3>
        <p class="why-desc"><?php echo esc_html($r['desc']); ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     TESTIMONIALS
════════════════════════════════════════════════════════ -->
<section class="testimonials-section">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Testimonials</span>
      <h2 class="section-title">Loved by <span class="honey-text">Families</span></h2>
      <p class="section-desc">Hear from families who've made Wonderlyf a part of their daily wellness.</p>
    </div>

    <div class="testimonials-grid">
      <?php
      $testimonials = [
        ['text'=>'The Forest Honey is absolutely pure! You can taste the difference from store-bought honey. Our family has switched completely.', 'name'=>'Priya Ramesh', 'loc'=>'Chennai, Tamil Nadu', 'stars'=>5],
        ['text'=>'Kambu Ladoo reminds me of my grandmother\'s cooking. Natural, nutritious, and absolutely delicious. My kids love it as an after-school snack!', 'name'=>'Kavitha Suresh', 'loc'=>'Coimbatore, Tamil Nadu', 'stars'=>5],
        ['text'=>'Keshkalpa has transformed my hair in just 6 weeks! My hair fall reduced significantly and the natural ingredients make me feel confident using it.', 'name'=>'Meena Krishnan', 'loc'=>'Bangalore, Karnataka', 'stars'=>5],
      ];
      foreach ($testimonials as $i => $t):
      ?>
      <div class="testimonial-card reveal reveal-delay-<?php echo $i+1; ?>">
        <div class="testimonial-stars">
          <?php echo str_repeat('★', $t['stars']); ?>
        </div>
        <p class="testimonial-text">&ldquo;<?php echo esc_html($t['text']); ?>&rdquo;</p>
        <div>
          <p class="testimonial-author-name"><?php echo esc_html($t['name']); ?></p>
          <p class="testimonial-author-loc"><?php echo esc_html($t['loc']); ?></p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════
     CTA SECTION
════════════════════════════════════════════════════════ -->
<section class="cta-section">
  <div class="container">
    <h2 class="cta-title reveal">Pure. Natural. Wonderlyf.</h2>
    <p class="cta-desc reveal reveal-delay-1">Join thousands of families who trust Wonderlyf for their wellness journey. Safe &amp; Secure Payments. Fast Delivery Across India.</p>
    <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-primary reveal reveal-delay-2">
      Shop Now →
    </a>
  </div>
</section>

<?php get_footer(); ?>
