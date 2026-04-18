<?php
/**
 * Template Name: About Page
 */
get_header(); ?>

<!-- About Hero -->
<section style="padding: 160px 0 80px; background: var(--cream-dark); text-align:center; position:relative; overflow:hidden;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(212,148,10,0.06) 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>
  <div class="container" style="position:relative;">
    <span class="section-subtitle">Our Story</span>
    <h1 class="section-title" style="margin-top:12px;">Purity, Warmth &amp;<br><span class="honey-text">Wonders of Home</span></h1>
    <p class="section-desc" style="margin-top:16px;">Born from a passion for preserving traditional wellness and time-honoured recipes.</p>
  </div>
</section>

<!-- Mission -->
<section style="padding: 100px 0; background:#fff;">
  <div class="container">
    <div class="about-grid">
      <div class="about-image reveal">
        <img src="https://wonderlyf.com/wp-content/uploads/2026/02/About-US_Wonderlyf.jpg" alt="Wonderlyf Kitchen" loading="lazy">
      </div>
      <div class="about-content reveal reveal-delay-2">
        <span class="section-subtitle">Our Mission</span>
        <h2 class="about-title">Why Wonderlyf Exists</h2>
        <p class="about-desc">
          In a world flooded with processed, chemical-laden foods, Wonderlyf was born to bring back the purity of traditional home cooking.
          We believe that the best medicine is food — food prepared with love, using ingredients exactly as nature intended.
        </p>
        <p class="about-desc">
          Founded in Erode, Tamil Nadu, we work closely with tribal communities, local farmers, and traditional cooks to bring you authentic products
          that nourish both body and soul.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Values -->
<section style="padding: 100px 0; background: var(--cream);">
  <div class="container">
    <div class="section-heading reveal">
      <span class="section-subtitle">Our Values</span>
      <h2 class="section-title">What We <span class="honey-text">Stand For</span></h2>
    </div>
    <div class="why-grid">
      <?php
      $values = [
        ['icon'=>'🌿','title'=>'100% Natural','desc'=>'We never use artificial colours, flavours or preservatives. Every ingredient is ethically sourced from nature.'],
        ['icon'=>'🤝','title'=>'Community First','desc'=>'We partner with tribal forest communities and local farmers, empowering livelihoods through fair trade.'],
        ['icon'=>'🧘','title'=>'Holistic Wellness','desc'=>'Our products are designed to nourish body, mind and soul — rooted in Ayurvedic wisdom.'],
        ['icon'=>'♻️','title'=>'Sustainability','desc'=>'We use eco-friendly packaging and sustainable sourcing practices to protect our planet.'],
        ['icon'=>'👨‍👩‍👧','title'=>'Family Values','desc'=>'Every product is something we would feed our own families — that\'s our quality promise.'],
        ['icon'=>'🔬','title'=>'Quality First','desc'=>'Rigorous quality checks on every batch ensure you always receive the best.'],
      ];
      foreach ($values as $i => $v):
      ?>
      <div class="why-card reveal reveal-delay-<?php echo ($i%3)+1; ?>">
        <span class="why-icon"><?php echo $v['icon']; ?></span>
        <h3 class="why-title"><?php echo esc_html($v['title']); ?></h3>
        <p class="why-desc"><?php echo esc_html($v['desc']); ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container">
    <h2 class="cta-title reveal">Ready to Experience Wonderlyf?</h2>
    <p class="cta-desc reveal reveal-delay-1">Browse our range of traditional wellness products and taste the difference of purity.</p>
    <a href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" class="btn btn-primary reveal reveal-delay-2">Shop Now →</a>
  </div>
</section>

<?php get_footer(); ?>
