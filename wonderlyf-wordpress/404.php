<?php get_header(); ?>

<section style="
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  text-align: center;
  padding: 80px 24px;
  position: relative;
  overflow: hidden;
">
  <!-- Background glow -->
  <div style="
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:600px; height:600px;
    background: radial-gradient(circle, rgba(212,148,10,0.06) 0%, transparent 70%);
    border-radius:50%; pointer-events:none;
  "></div>

  <div style="position:relative; max-width:520px;">
    <!-- Giant 404 -->
    <div style="
      font-family:'Playfair Display',serif;
      font-size: clamp(100px, 20vw, 160px);
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, var(--honey) 0%, var(--honey-dark) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    ">404</div>

    <!-- Honey jar icon -->
    <div style="font-size:56px; margin-bottom:24px;">🍯</div>

    <h1 style="
      font-family:'Playfair Display',serif;
      font-size: clamp(24px, 4vw, 36px);
      font-weight: 700;
      color: var(--warm-brown);
      margin-bottom: 16px;
    ">Oops! Page Not Found</h1>

    <p style="
      font-size: 16px;
      color: var(--warm-light);
      line-height: 1.7;
      margin-bottom: 40px;
    ">
      Looks like this page has gone back to the forest.
      Let's get you back to the good stuff.
    </p>

    <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
      <a href="<?php echo home_url('/'); ?>" class="btn btn-primary">
        ← Back to Home
      </a>
      <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-ghost">
        Visit Shop
      </a>
    </div>
  </div>
</section>

<?php get_footer(); ?>
