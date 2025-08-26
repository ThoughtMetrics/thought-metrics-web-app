//Home.tsx
// import { SEOHead } from '@/shared/components/seo/SEOHead';
import {
  B2BServices,
  Blogs,
  HeroCarousel,
  Industries,
  SolutionInsights,
} from './components';
// import { seoContent } from '@/core/constants/seo.constants';


const Home: React.FC = () => {
  return (
    <>
      {/* <SEOHead
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        ogImage={seoContent.ogImage}
        canonicalUrl={seoContent.canonicalUrl}
        structuredData={seoContent.structuredData}
      /> */}
      <HeroCarousel />
      <SolutionInsights />
      <B2BServices />
      <Industries />
      <Blogs />
    </>
  );
};

export default Home;
