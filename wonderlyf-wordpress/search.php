<?php get_header(); ?>

<div style="padding: 140px 0 100px; background: var(--cream); min-height: 60vh;">
  <div class="container">

    <div class="section-heading reveal">
      <span class="section-subtitle">Search Results</span>
      <h1 class="section-title">
        <?php if ( have_posts() ) : ?>
          Results for <span class="honey-text">"<?php echo get_search_query(); ?>"</span>
        <?php else : ?>
          No results for <span class="honey-text">"<?php echo get_search_query(); ?>"</span>
        <?php endif; ?>
      </h1>
    </div>

    <!-- Search form -->
    <div style="max-width:520px; margin: 0 auto 60px;">
      <form role="search" method="get" action="<?php echo home_url('/'); ?>" style="display:flex; gap:12px;">
        <input type="search" name="s" value="<?php echo get_search_query(); ?>"
          placeholder="Search products, recipes..."
          style="flex:1; padding:14px 20px; border:1.5px solid rgba(212,148,10,0.25); border-radius:999px; font-size:15px; font-family:'DM Sans',sans-serif; background:#fff; outline:none; color:var(--warm-brown);">
        <button type="submit" class="btn btn-primary" style="padding:14px 28px;">Search</button>
      </form>
    </div>

    <?php if ( have_posts() ) : ?>
    <div class="products-grid">
      <?php while ( have_posts() ) : the_post(); ?>
      <div class="product-card reveal">
        <?php if ( has_post_thumbnail() ) : ?>
        <div class="product-card-image">
          <a href="<?php the_permalink(); ?>">
            <?php the_post_thumbnail('wonderlyf-product', ['class'=>'']); ?>
          </a>
        </div>
        <?php endif; ?>
        <div class="product-card-body">
          <p class="product-category"><?php echo get_post_type(); ?></p>
          <h3 class="product-name"><a href="<?php the_permalink(); ?>" style="color:inherit;"><?php the_title(); ?></a></h3>
          <p class="product-desc"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
          <div class="product-footer">
            <a href="<?php the_permalink(); ?>" class="product-add-btn" style="text-decoration:none;">View →</a>
          </div>
        </div>
      </div>
      <?php endwhile; ?>
    </div>

    <?php else : ?>
    <div style="text-align:center; padding:60px 0;">
      <div style="font-size:64px; margin-bottom:20px;">🔍</div>
      <p style="color:var(--warm-light); font-size:16px; margin-bottom:32px;">
        We couldn't find anything matching your search. Try different keywords or browse our shop.
      </p>
      <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>" class="btn btn-primary">Browse All Products →</a>
    </div>
    <?php endif; ?>

  </div>
</div>

<?php get_footer(); ?>
