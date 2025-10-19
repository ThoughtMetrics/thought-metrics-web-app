import HeroSection from '@/shared/ui/templates/hero-section';
import { researchMethods } from '../../research-methods.constant';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { ResearchMethodActionSection } from '@/shared/ui/templates/action-section';
import { ResearchMethodQuestionarySection } from '@/shared/ui/templates/questionary-section';
import { ProductResearchSection } from '@/shared/ui/templates/service-section';
import AboutUsSection from './components/about-us';
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

interface FieldworkPageProps {
  blogData?: BlogData | null;
}

const ResearchMethodFieldwork: React.FC<FieldworkPageProps> = ({ blogData }) => {
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
      {blogData ? (
        <BlogOrganism data={blogData} bgColor="bg-custom-blue-light" />
      ) : (
        <BlogSkeleton />
      )}
      <ResearchMethodActionSection actionSection={pageContent.actionSection} />
    </>
  );
};

export default ResearchMethodFieldwork;
