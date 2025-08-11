import { cn } from '@/core/utils/cn';
import CustomImageAtom from '../../atoms/custom-image';
import QuestionaryCard from '../../molecules/questionary-card';

const QuestionarySection: React.FC<any> = ({
  questionarySection,
  className,
  qandaClassName,
  imgClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative bg-primary-lighter text-black">
      <div
        className={cn(
          'common-container px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] !grid grid-cols-1 md:grid-cols-2',
          className
        )}
      >
        <div className="w-full md:w-[80%] flex flex-col gap-3">
          <h2 className="text-xl md:text-3xl font-semibold leading-[1.25] tracking-wide flex flex-col gap-2">
            <span>{questionarySection.title}</span>
            <div className="w-25 h-1 bg-primary rounded"></div>
          </h2>
          <p
            className="leading-5 text-text-dark font-medium text-md md:text-lg pb-5"
            dangerouslySetInnerHTML={{
              __html: questionarySection.description,
            }}
          />
          <CustomImageAtom
            src={questionarySection.illustration.img}
            size={questionarySection.illustration.size}
            rounded={questionarySection.illustration.rounded}
            aspectRatio={questionarySection.illustration.aspectRatio}
            objectFit={questionarySection.illustration.objectFit}
            loading={questionarySection.illustration.loading}
            className={imgClassName}
          />
        </div>
        <div className="w-full h-full">
          <QuestionaryCard
            questionnaires={questionarySection.questionnaires}
            className={qandaClassName}
          />
        </div>
      </div>
    </section>
  );
};

export default QuestionarySection;
