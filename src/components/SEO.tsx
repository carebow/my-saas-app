
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  alternateLanguages?: { hreflang: string; href: string }[];
}

const SEO = ({
  title = "CareBow | AI-Powered In-Home Healthcare Network in USA",
  description = "CareBow is USA's first tech-enabled in-home care network, bringing AI-powered, compassionate healthcare directly to your doorstep. Join our waitlist for personalized home healthcare services in Pittsburgh, PA and nationwide.",
  keywords = "home healthcare USA, in-home care Pittsburgh, AI healthcare, telemedicine services, elder care at home, pediatric home care, post-surgery recovery, urgent care at home, medication management, health monitoring, 24/7 healthcare, remote patient care, digital health Pittsburgh, healthcare innovation, personalized medical care, HIPAA compliant healthcare, licensed healthcare providers, medical care delivery, home nursing services, chronic disease management",
  image = "https://www.carebow.com/images/carebow-logo.png",
  url = "https://www.carebow.com",
  type = "website",
  structuredData,
  article,
  noindex = false,
  alternateLanguages = []
}: SEOProps) => {
  // Ensure title is under 60 characters for optimal SEO
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
  
  // Ensure description is between 150-160 characters for optimal SEO
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="CareBow" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Language and Locale */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="US-PA" />
      <meta name="geo.placename" content="Pittsburgh" />
      <meta name="geo.position" content="40.4406;-79.9959" />
      <meta name="ICBM" content="40.4406, -79.9959" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="CareBow - AI-Powered In-Home Healthcare Network" />
      <meta property="og:site_name" content="CareBow" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@carebow" />
      <meta name="twitter:creator" content="@carebow" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="CareBow - AI-Powered In-Home Healthcare Network" />
      
      {/* LinkedIn */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="application-name" content="CareBow" />
      <meta name="apple-mobile-web-app-title" content="CareBow" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Alternate Language Links */}
      {alternateLanguages.map(lang => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
