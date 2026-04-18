<?php get_header(); ?>

<div style="padding: 140px 0 100px; background: var(--cream); min-height: 60vh;">
  <div class="container" style="max-width: 860px;">

    <?php while ( have_posts() ) : the_post(); ?>

      <div class="reveal">
        <span class="section-subtitle"><?php the_date(); ?></span>
        <h1 class="section-title" style="text-align:left; margin-top:12px;"><?php the_title(); ?></h1>
      </div>

      <div class="page-content reveal reveal-delay-1" style="
        margin-top: 40px;
        background: #fff;
        border-radius: 20px;
        padding: 48px;
        border: 1px solid rgba(212,148,10,0.1);
        box-shadow: 0 4px 20px rgba(212,148,10,0.08);
        line-height: 1.85;
        font-size: 16px;
        color: var(--warm-gray);
      ">
        <?php the_content(); ?>
      </div>

    <?php endwhile; ?>

  </div>
</div>

<?php get_footer(); ?>
