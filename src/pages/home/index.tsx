//Home.tsx
import {
  B2BServices,
  Blogs,
  HeroCarousel,
  Industries,
  SolutionInsights,
} from './components';

const Home: React.FC = () => {
  return (
    <>
      <HeroCarousel />
      <SolutionInsights />
      <B2BServices />
      <Industries />
      <Blogs />
    </>
  );
};

export default Home;
