import { cn } from '@/core/utils/cn';
import './quality-case-study.css';

const QualityCaseStudySection: React.FC<any> = ({
  caseStudySection,
  className,
}: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black quality-case-study-component">
      <div className="hidden md:flex h-full w-full absolute justify-end">
        <caseStudySection.illustrationComponent className="h-full w-fit" />
      </div>
      <div
        className={cn(
          'common-container px-6 pt-14 pb-8 md:p-0 !max-w-[1336px] !grid grid-cols-1 md:grid-cols-[47.5%_53%] items-center justify-between',
          className
        )}
      >
        <div className="w-full flex flex-col gap-3 md:pl-24 md:py-14">
          <h2 className="flex flex-col gap-2">
            <span className="text-xl md:text-3xl font-semibold">
              {caseStudySection.head}
            </span>
            <div className="w-25 h-0.5 md:h-1 bg-primary rounded"></div>
          </h2>
          <p className="md:w-[83.5%] text-xl md:text-3xl">
            {caseStudySection.title}
          </p>
          <p className="md:w-[83.5%] text-md md:text-base leading-5">
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
      </div>
    </section>
  );
};

export default QualityCaseStudySection;
