import { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  structuredData?: object;
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData,
  meta = [],
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        const [attr, value] = selector
          .replace('meta[', '')
          .replace(']', '')
          .split('=');
        element.setAttribute(attr, value.replace(/["']/g, ''));
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Standard meta tags
    if (description) {
      updateMetaTag('meta[name="description"]', description);
      updateMetaTag('meta[property="og:description"]', description);
      updateMetaTag('meta[name="twitter:description"]', description);
    }

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:type"]', ogType);

    if (ogImage) {
      updateMetaTag('meta[property="og:image"]', ogImage);
      updateMetaTag('meta[name="twitter:image"]', ogImage);
    }

    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', canonicalUrl);

      // Update canonical link
      let canonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Twitter Card
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title);

    // Custom meta tags
    meta.forEach((tag) => {
      if (tag.name) {
        updateMetaTag(`meta[name="${tag.name}"]`, tag.content);
      } else if (tag.property) {
        updateMetaTag(`meta[property="${tag.property}"]`, tag.content);
      }
    });

    // Structured data
    if (structuredData) {
      let script = document.querySelector(
        'script[type="application/ld+json"]'
      ) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [
    title,
    description,
    keywords,
    ogImage,
    ogType,
    canonicalUrl,
    structuredData,
    meta,
  ]);

  return null;
};
