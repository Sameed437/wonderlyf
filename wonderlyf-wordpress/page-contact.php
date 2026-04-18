<?php
/**
 * Template Name: Contact Page
 */
get_header(); ?>

<section style="padding: 160px 0 80px; background: var(--cream-dark); text-align:center;">
  <div class="container">
    <span class="section-subtitle">Get in Touch</span>
    <h1 class="section-title" style="margin-top:12px;">Contact <span class="honey-text">Wonderlyf</span></h1>
    <p class="section-desc" style="margin-top:16px;">We'd love to hear from you. Reach out for orders, feedback or anything else.</p>
  </div>
</section>

<section style="padding: 80px 0 120px; background: var(--cream);">
  <div class="container">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start;">

      <!-- Contact Info -->
      <div class="reveal">
        <h2 style="font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:var(--warm-brown); margin-bottom:32px;">
          Let's Connect
        </h2>

        <div style="display:flex;flex-direction:column;gap:24px;">
          <div style="display:flex;gap:16px;align-items:flex-start;">
            <div style="width:48px;height:48px;background:rgba(212,148,10,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📧</div>
            <div>
              <p style="font-weight:600;color:var(--warm-brown);margin-bottom:4px;">Email</p>
              <a href="mailto:info@wonderlyf.com" style="color:var(--warm-light);">info@wonderlyf.com</a>
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;">
            <div style="width:48px;height:48px;background:rgba(212,148,10,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📞</div>
            <div>
              <p style="font-weight:600;color:var(--warm-brown);margin-bottom:4px;">Phone / WhatsApp</p>
              <a href="tel:+916382663539" style="color:var(--warm-light);">+91 63826 63539</a>
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;">
            <div style="width:48px;height:48px;background:rgba(212,148,10,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📍</div>
            <div>
              <p style="font-weight:600;color:var(--warm-brown);margin-bottom:4px;">Location</p>
              <p style="color:var(--warm-light);">Erode, Tamil Nadu, India</p>
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;">
            <div style="width:48px;height:48px;background:rgba(212,148,10,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">⏰</div>
            <div>
              <p style="font-weight:600;color:var(--warm-brown);margin-bottom:4px;">Business Hours</p>
              <p style="color:var(--warm-light);">Mon – Sat: 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="reveal reveal-delay-2">
        <div style="background:#fff;border-radius:24px;padding:40px;border:1px solid rgba(212,148,10,0.1);box-shadow:var(--shadow-warm);">
          <?php
          // Use Contact Form 7 shortcode if installed
          if (shortcode_exists('contact-form-7')) {
            echo do_shortcode('[contact-form-7 id="1" title="Contact form 1"]');
          } else {
          ?>
          <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="POST"
                style="display:flex;flex-direction:column;gap:20px;">
            <?php wp_nonce_field('wonderlyf_contact', 'contact_nonce'); ?>
            <input type="hidden" name="action" value="wonderlyf_contact">

            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--warm-brown);margin-bottom:6px;">Your Name *</label>
              <input type="text" name="name" required
                style="width:100%;padding:12px 16px;border:1.5px solid rgba(212,148,10,0.2);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;background:var(--cream);outline:none;"
                onfocus="this.style.borderColor='var(--honey)'" onblur="this.style.borderColor='rgba(212,148,10,0.2)'">
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--warm-brown);margin-bottom:6px;">Email Address *</label>
              <input type="email" name="email" required
                style="width:100%;padding:12px 16px;border:1.5px solid rgba(212,148,10,0.2);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;background:var(--cream);outline:none;"
                onfocus="this.style.borderColor='var(--honey)'" onblur="this.style.borderColor='rgba(212,148,10,0.2)'">
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--warm-brown);margin-bottom:6px;">Phone Number</label>
              <input type="tel" name="phone"
                style="width:100%;padding:12px 16px;border:1.5px solid rgba(212,148,10,0.2);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;background:var(--cream);outline:none;"
                onfocus="this.style.borderColor='var(--honey)'" onblur="this.style.borderColor='rgba(212,148,10,0.2)'">
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--warm-brown);margin-bottom:6px;">Message *</label>
              <textarea name="message" required rows="5"
                style="width:100%;padding:12px 16px;border:1.5px solid rgba(212,148,10,0.2);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;background:var(--cream);outline:none;resize:vertical;"
                onfocus="this.style.borderColor='var(--honey)'" onblur="this.style.borderColor='rgba(212,148,10,0.2)'"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
              Send Message →
            </button>
          </form>
          <?php } ?>
        </div>
      </div>

    </div>
  </div>
</section>

<?php get_footer(); ?>
