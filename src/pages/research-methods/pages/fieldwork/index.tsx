import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import { ProductResearchSection } from '@/shared/ui/templates/service-section';
import AboutUsSection from './components/about-us';

const ResearchMethodFieldwork: React.FC = () => {
  const pageContent = researchMethods.fieldwork;
  return (
    <>
      <HeroSection
        contentClassName="gap-10"
        heroSection={pageContent.heroSection}
      />
      <ProductResearchSection serviceSection={pageContent.serviceSection} />
      <ResearchMethodQuestionarySection
        questionarySection={pageContent.questionarySection}
        titleClassName="w-[13rem] xl:w-[19rem]"
        illustrationClassName="-right-[3.5rem] xl:-right-[2rem] xxl:-right-[4.5rem]"
      />
      <AboutUsSection
        questionarySection={pageContent.aboutUsSection}
        className=""
        imgClassName="!h-[65%] w-full"
      />
      <BlogOrganism
        data={pageContent.blogData}
        bgColor="bg-custom-blue-light"
      />
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodFieldwork;
