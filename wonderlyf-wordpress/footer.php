<!-- ── Footer ───────────────────────────────────────────────── -->
<footer id="site-footer">
  <div class="container">

    <div class="footer-grid">

      <!-- Brand -->
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="https://wonderlyf.com/wp-content/uploads/2026/01/Logo_Wonderlyf-1.png"
               alt="Wonderlyf" width="140" height="40" loading="lazy">
        </div>
        <p>Traditional wellness products rooted in ancient wisdom. Pure. Natural. Homemade. Bringing the wonders of nature to your doorstep.</p>
        <div class="footer-social" style="margin-top:20px;">
          <a href="https://www.instagram.com/wonderlyf_official/" target="_blank" rel="noopener" aria-label="Instagram">📷</a>
          <a href="https://www.facebook.com/wonderlyf" target="_blank" rel="noopener" aria-label="Facebook">👍</a>
          <a href="https://www.youtube.com/@wonderlyf" target="_blank" rel="noopener" aria-label="YouTube">▶</a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="footer-heading">Quick Links</h3>
        <div class="footer-links">
          <a href="<?php echo home_url('/'); ?>">Home</a>
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>">Shop</a>
          <a href="<?php echo home_url('/about'); ?>">About Us</a>
          <a href="<?php echo home_url('/contact'); ?>">Contact</a>
          <a href="<?php echo home_url('/blog'); ?>">Blog</a>
        </div>
      </div>

      <!-- Categories -->
      <div>
        <h3 class="footer-heading">Categories</h3>
        <div class="footer-links">
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>?product_cat=honey">Honey</a>
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>?product_cat=ladoo">Ladoo &amp; Sweets</a>
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>?product_cat=soup-mix">Soup Mixes</a>
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>?product_cat=hair-care">Hair Care</a>
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>?product_cat=relish">Relish &amp; Pickles</a>
        </div>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="footer-heading">Contact Us</h3>
        <div class="footer-contact-item">
          <span class="icon">📧</span>
          <a href="mailto:info@wonderlyf.com" style="color:rgba(255,249,240,0.6)">info@wonderlyf.com</a>
        </div>
        <div class="footer-contact-item">
          <span class="icon">📞</span>
          <a href="tel:+916382663539" style="color:rgba(255,249,240,0.6)">+91 63826 63539</a>
        </div>
        <div class="footer-contact-item">
          <span class="icon">📍</span>
          <span>Erode, Tamil Nadu, India</span>
        </div>
        <div style="margin-top:20px;">
          <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-primary" style="font-size:13px; padding:10px 24px;">
            Shop Now →
          </a>
        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <span>© <?php echo date('Y'); ?> Wonderlyf. All rights reserved.</span>
      <div style="display:flex; gap:20px;">
        <a href="<?php echo home_url('/privacy-policy'); ?>" style="color:rgba(255,249,240,0.35)">Privacy Policy</a>
        <a href="<?php echo home_url('/terms-conditions'); ?>" style="color:rgba(255,249,240,0.35)">Terms &amp; Conditions</a>
        <a href="<?php echo home_url('/refund-policy'); ?>" style="color:rgba(255,249,240,0.35)">Refund Policy</a>
      </div>
    </div>

  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
