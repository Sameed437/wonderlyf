import { Helmet } from "react-helmet-async";

const SITE_URL = "https://wonderlyf.co.uk";
const SITE_NAME = "Wonderlyf UK";
const DEFAULT_IMAGE = "https://wonderlyf.com/wp-content/uploads/2026/01/Natures-Gold-1.jpg";

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  structuredData,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Traditional Indian Wellness Products | Free UK Delivery`;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_GB" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
