import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import { CustomerResearchSection } from '@/shared/ui/templates/service-section';
import AboutUsSection from './components/about-us';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import RightPathSection from './components/right-path';

const ResearchMethodFocusGroup: React.FC = () => {
  const pageContent = researchMethods.focus_group;
  return (
    <>
      <HeroSection
        heroSection={pageContent.heroSection}
        contentClassName="xl:w-[42%] xxl:w-[38%] wide:w-[50%]"
        titleClassName="w-full"
      />
      <CustomerResearchSection serviceSection={pageContent.serviceSection} />
      <RightPathSection rightPathSection={pageContent.questionarySection} />
      <AboutUsSection questionarySection={pageContent.aboutUsSection} />
      <BlogOrganism
        data={pageContent.blogData}
        bgColor="bg-custom-blue-light"
      />
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodFocusGroup;
