import { SEO_ROUTES_CONFIG } from '../config/seoRoutes';
import { usePageSeo } from '../hooks/usePageSeo';
import { AddImageToPdfConverter } from '../components/AddImageToPdfConverter';
import { SeoContent } from '../components/SeoContent';

export function AddImageToPdfPage() {
  const config = SEO_ROUTES_CONFIG['/add-image-to-pdf'];

  // Dynamically update document title ("Add Image to PDF Online - 100% Free") and meta tags
  usePageSeo(config);

  return (
    <main className="page-content" id="main-content">
      <AddImageToPdfConverter config={config} />
      <SeoContent config={config} />
    </main>
  );
}
