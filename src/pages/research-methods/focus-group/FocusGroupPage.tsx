import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../research-methods.constant';
import { CustomerResearchSection } from '@/shared/ui/templates/service-section';
import AboutUsSection from './components/about-us';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import RightPathSection from './components/right-path';
import BlogSkeleton from '@/shared/components/blog-skeleton';

interface BlogData {
  title: string;
  items: {
    id: number;
    type: string;
    category: string;
    label: string;
    description: string;
    link: string;
    src: string;
  }[];
}

interface FocusGroupPageProps {
  blogData?: BlogData | null;
}

const ResearchMethodFocusGroup: React.FC<FocusGroupPageProps> = ({ blogData }) => {
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
      {blogData ? (
        <BlogOrganism data={blogData} bgColor="bg-custom-blue-light" />
      ) : (
        <BlogSkeleton />
      )}
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodFocusGroup;
