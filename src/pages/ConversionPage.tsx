import { useLocation } from 'react-router-dom';
import { SEO_ROUTES_CONFIG } from '../config/seoRoutes';
import { usePageSeo } from '../hooks/usePageSeo';
import { Converter } from '../components/Converter';
import { SeoContent } from '../components/SeoContent';

export function ConversionPage() {
  const location = useLocation();

  // Find configuration for the current route, fallback to root
  const config = SEO_ROUTES_CONFIG[location.pathname] || SEO_ROUTES_CONFIG['/'];

  // Dynamically update document.title and meta tags inside useEffect
  usePageSeo(config);

  return (
    <main className="page-content" id="main-content">
      <Converter config={config} />
      <SeoContent config={config} />
    </main>
  );
}
