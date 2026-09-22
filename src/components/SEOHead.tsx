import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

export const SEOHead: React.FC = () => {
  const { getCurrentSEO, siteConfig } = useCMS();
  const currentSEO = getCurrentSEO();

  useEffect(() => {
    if (currentSEO) {
      document.title = currentSEO.metaTitle || `${siteConfig.companyName} | Soluções Corporativas`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', currentSEO.metaDescription);

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', currentSEO.metaTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', currentSEO.metaDescription);

      if (currentSEO.ogImage) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (!ogImg) {
          ogImg = document.createElement('meta');
          ogImg.setAttribute('property', 'og:image');
          document.head.appendChild(ogImg);
        }
        ogImg.setAttribute('content', currentSEO.ogImage);
      }

      // Add keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', currentSEO.keywords);

      // Structured Data (JSON-LD Schema.org)
      let scriptSchema = document.getElementById('jsonld-schema');
      if (!scriptSchema) {
        scriptSchema = document.createElement('script');
        scriptSchema.id = 'jsonld-schema';
        scriptSchema.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptSchema);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: siteConfig.companyName,
        description: siteConfig.description,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address,
        },
        url: window.location.origin,
      };

      scriptSchema.textContent = JSON.stringify(structuredData);
    }
  }, [currentSEO, siteConfig]);

  return null;
};
