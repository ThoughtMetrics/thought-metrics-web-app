import { cn } from '@/core/utils/cn';
import './quality-case-study.css';

const QualityCaseStudySection: React.FC<any> = ({
  caseStudySection,
  className,
}: any) => {
  return (
    <section className="common-component w-full relative bg-white text-black quality-case-study-component items-center !grid md:grid-cols-2">
      <div className="hidden md:flex w-full min-h-[18rem] xl:min-h-[30rem] xxl:min-h-[40rem] wide:min-h-[45rem]">
        <caseStudySection.illustrationComponent className="h-full w-full" />
      </div>
      <div
        className={cn(
          'common-container flex-col px-6 py-5 md:px-28 wide:px-48 gap-3',
          className
        )}
      >
        <h2 className="flex flex-col gap-2">
          <span className="text-xl md:text-3xl font-semibold">
            {caseStudySection.head}
          </span>
          <div className="w-25 h-0.5 md:h-1 bg-primary rounded"></div>
        </h2>
        <p className="md:w-[83.5%] text-xl md:text-3xl">
          {caseStudySection.title}
        </p>
        <p className="text-md md:text-base leading-5">
          {caseStudySection.description}
        </p>
        <img
          src="/images/research_methods_quality_1.png"
          className="md:hidden w-full h-fit"
        />
        <ul className={cn('text-md md:text-base space-y-2', className)}>
          {caseStudySection.list.map((value: string) => {
            return <p className="leading-5">{value}</p>;
          })}
        </ul>
      </div>
    </section>
  );
};

export default QualityCaseStudySection;
