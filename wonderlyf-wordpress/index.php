<?php get_header(); ?>

<div style="padding: 140px 0 80px;">
  <div class="container">
    <?php if ( have_posts() ): ?>
      <?php while ( have_posts() ): the_post(); ?>
        <article>
          <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <?php the_excerpt(); ?>
        </article>
      <?php endwhile; ?>
    <?php else: ?>
      <p>No content found.</p>
    <?php endif; ?>
  </div>
</div>

<?php get_footer(); ?>
