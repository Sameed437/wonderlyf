<?php get_header(); ?>

<div style="padding: 140px 0 100px; background: var(--cream); min-height: 60vh;">
  <div class="container" style="max-width: 860px;">

    <?php while ( have_posts() ) : the_post(); ?>

      <!-- Post header -->
      <div class="reveal" style="margin-bottom: 40px;">
        <?php
        $cats = get_the_category();
        if ( $cats ) {
          echo '<span class="section-subtitle">' . esc_html( $cats[0]->name ) . '</span>';
        }
        ?>
        <h1 style="font-family:'Playfair Display',serif; font-size: clamp(28px,4vw,48px); font-weight:800; color:var(--warm-brown); margin: 16px 0 20px; line-height:1.2;">
          <?php the_title(); ?>
        </h1>
        <div style="display:flex; align-items:center; gap:16px; color:var(--warm-light); font-size:14px;">
          <span><?php echo get_the_date(); ?></span>
          <span style="width:4px;height:4px;background:var(--honey);border-radius:50%;display:inline-block;"></span>
          <span><?php echo get_the_author(); ?></span>
          <span style="width:4px;height:4px;background:var(--honey);border-radius:50%;display:inline-block;"></span>
          <span><?php echo ceil( str_word_count( strip_tags( get_the_content() ) ) / 200 ); ?> min read</span>
        </div>
      </div>

      <!-- Featured image -->
      <?php if ( has_post_thumbnail() ) : ?>
      <div class="reveal" style="margin-bottom:40px; border-radius:20px; overflow:hidden; box-shadow: 0 8px 40px rgba(212,148,10,0.15);">
        <?php the_post_thumbnail( 'full', [ 'style' => 'width:100%; height:400px; object-fit:cover;' ] ); ?>
      </div>
      <?php endif; ?>

      <!-- Content -->
      <div class="reveal reveal-delay-1" style="
        background: #fff;
        border-radius: 20px;
        padding: 48px;
        border: 1px solid rgba(212,148,10,0.1);
        box-shadow: 0 4px 20px rgba(212,148,10,0.08);
        line-height: 1.9;
        font-size: 17px;
        color: var(--warm-gray);
        margin-bottom: 40px;
      ">
        <?php the_content(); ?>
      </div>

      <!-- Tags -->
      <?php $tags = get_the_tags(); if ( $tags ) : ?>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:48px;">
        <?php foreach ( $tags as $tag ) : ?>
          <a href="<?php echo get_tag_link( $tag->term_id ); ?>" style="
            background: rgba(212,148,10,0.08);
            color: var(--honey-dark);
            border: 1px solid rgba(212,148,10,0.2);
            border-radius: 999px;
            padding: 6px 16px;
            font-size: 13px;
            font-weight: 600;
          "><?php echo esc_html( $tag->name ); ?></a>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>

      <!-- Post nav -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:48px;">
        <?php
        $prev = get_previous_post();
        $next = get_next_post();
        if ( $prev ) : ?>
        <a href="<?php echo get_permalink( $prev->ID ); ?>" style="
          background:#fff; border-radius:16px; padding:20px;
          border:1px solid rgba(212,148,10,0.1);
          box-shadow: 0 4px 20px rgba(212,148,10,0.08);
          text-decoration:none;
        ">
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:.15em; color:var(--honey); font-weight:600;">← Previous</span>
          <p style="color:var(--warm-brown); font-weight:700; margin-top:6px; font-size:15px;"><?php echo esc_html( $prev->post_title ); ?></p>
        </a>
        <?php else: ?><div></div><?php endif; ?>

        <?php if ( $next ) : ?>
        <a href="<?php echo get_permalink( $next->ID ); ?>" style="
          background:#fff; border-radius:16px; padding:20px;
          border:1px solid rgba(212,148,10,0.1);
          box-shadow: 0 4px 20px rgba(212,148,10,0.08);
          text-decoration:none; text-align:right;
        ">
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:.15em; color:var(--honey); font-weight:600;">Next →</span>
          <p style="color:var(--warm-brown); font-weight:700; margin-top:6px; font-size:15px;"><?php echo esc_html( $next->post_title ); ?></p>
        </a>
        <?php endif; ?>
      </div>

    <?php endwhile; ?>

  </div>
</div>

<?php get_footer(); ?>
