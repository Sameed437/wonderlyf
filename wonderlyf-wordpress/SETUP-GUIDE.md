# Wonderlyf WordPress Theme — Setup Guide

## What's Inside
A complete custom WordPress theme with:
- Warm honey/cream design (matches your React site)
- Floating honey animations (hexagons, drops, leaves, petals)
- Hero video background
- WooCommerce product grid + cart
- Category carousel
- Our Process timeline
- About, Why Choose Us, Testimonials sections
- Mobile-first, performance-optimized

---

## Step 1 — Get WordPress Hosting

**Recommended (Fast):**
- **Hostinger** (₹99/month) — Fastest budget option, great in India
- **Cloudways** ($11/month) — Best performance, DigitalOcean servers
- **Kinsta** ($35/month) — Premium, fastest globally

**During signup:** Choose PHP 8.2 + MySQL 8.0

---

## Step 2 — Install WordPress

Most hosts have a 1-click WordPress installer. After installing:

1. Go to `yoursite.com/wp-admin`
2. Login with your admin credentials

---

## Step 3 — Install Required Plugins

Go to **Plugins → Add New** and install:

| Plugin | Why |
|--------|-----|
| **WooCommerce** | Products, cart, checkout |
| **WP Rocket** | Caching & speed (paid, ~$59/yr) OR **LiteSpeed Cache** (free) |
| **Smush** or **ShortPixel** | Image compression |
| **RankMath SEO** | SEO optimization |
| **Contact Form 7** | Contact page form |
| **Cloudflare** | Free CDN (sign up at cloudflare.com) |

---

## Step 4 — Upload the Theme

**Option A — via Dashboard:**
1. Zip the `wonderlyf-wordpress` folder
2. Go to **Appearance → Themes → Add New → Upload Theme**
3. Upload the zip → Activate

**Option B — via FTP/File Manager:**
1. Upload `wonderlyf-wordpress` folder to `/wp-content/themes/`
2. Go to **Appearance → Themes** → Activate Wonderlyf

---

## Step 5 — Setup WooCommerce

1. Run the WooCommerce setup wizard
2. Go to **WooCommerce → Settings:**
   - Currency: Indian Rupee (₹)
   - Country: India
   - Enable Cash on Delivery + Razorpay (for UPI/card payments)

3. **Add Products** — Products → Add New:
   - Product name, description, price
   - Upload product image
   - Set category (Honey, Ladoo, Soup Mix, etc.)
   - Mark as Featured to show on homepage

---

## Step 6 — Upload Your Hero Video

1. Go to your WordPress file manager (or FTP)
2. Upload `honey-hero.mp4` to: `/wp-content/themes/wonderlyf-wordpress/assets/videos/`
3. (The file is already included in this theme folder)

---

## Step 7 — Create Pages

Go to **Pages → Add New** and create:

| Page Title | Template to Select |
|-----------|-------------------|
| Home | Front Page (set in Settings → Reading) |
| About | About Page |
| Contact | Contact Page |
| Shop | (WooCommerce creates this automatically) |

**Set Homepage:**
- Go to **Settings → Reading**
- Select "A static page"
- Homepage: `Home`

---

## Step 8 — Upload Logo

1. Go to **Appearance → Customize → Site Identity**
2. Upload your Wonderlyf logo
3. OR it will use the default URL automatically

---

## Step 9 — Speed Optimization

### With WP Rocket (recommended):
- Enable Page Caching
- Enable GZIP compression
- Minify CSS/JS
- Enable LazyLoad for images
- Enable CDN (Cloudflare)

### With LiteSpeed Cache (free):
- Enable Page Cache
- Enable Image Optimization
- Enable CSS/JS Minification

### Cloudflare (free CDN):
1. Sign up at cloudflare.com
2. Add your domain
3. Enable "Speed → Optimization → Rocket Loader"
4. Set Cache Level: Standard
5. Enable HTTP/2 + HTTP/3

---

## Step 10 — Razorpay for Payments

1. Sign up at razorpay.com
2. Install **Razorpay for WooCommerce** plugin
3. Add your API key & secret
4. Enables: UPI, Net Banking, Cards, Wallets

---

## Performance Targets (after optimization)

| Metric | Target |
|--------|--------|
| PageSpeed Mobile | 85+ |
| PageSpeed Desktop | 95+ |
| LCP | < 2.5s |
| TTFB | < 200ms |
| Page Size | < 500KB |

---

## File Structure
```
wonderlyf-wordpress/
├── style.css              ← Theme declaration
├── functions.php          ← Theme setup, WooCommerce, AJAX
├── header.php             ← Nav + floating elements
├── footer.php             ← Footer
├── front-page.php         ← Homepage (Hero, Products, Process...)
├── index.php              ← Blog/fallback
├── woocommerce.php        ← Shop page wrapper
├── page-about.php         ← About page template
├── page-contact.php       ← Contact page template
├── inc/
│   └── performance.php    ← Speed optimizations
└── assets/
    ├── css/main.css        ← All styles (honey/cream theme)
    ├── js/main.js          ← Animations + interactions
    └── videos/
        └── honey-hero.mp4  ← Hero background video
```

---

## Need Razorpay / WhatsApp Button / Instagram Feed?

These can be added easily:
- **Razorpay**: WooCommerce plugin (free)
- **WhatsApp Button**: "Click to Chat" plugin (free)
- **Instagram Feed**: "Smash Balloon Instagram Feed" plugin (free)
- **Reviews**: WooCommerce built-in reviews or "Trustpilot" plugin
