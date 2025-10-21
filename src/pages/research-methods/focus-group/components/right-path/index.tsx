import {
  GreyEllipseIcon,
  IllustrationRightRespondentsIcon,
  IllustrationRightRespondentsMIcon,
  RedEllipseIcon,
} from '@/assets';
import { cn } from '@/core/utils/cn';

const RightPathSection: React.FC<any> = ({
  rightPathSection,
  className,
}: any) => {
  return (
    <section className="common-component relative bg-primary-lighter text-black">
        <div className="absolute top-0 -right-8 md:right-0 transform -translate-y-1/2 z-1">
          <RedEllipseIcon className="h-[8rem] md:h-[15rem] xxl:h-[35rem]" />
        </div>
        <div className="absolute bottom-0 -left-10 md:-left-4 transform translate-y-1/2 z-1">
          <GreyEllipseIcon className="h-[8rem] md:h-[15rem] xxl:h-[35rem]" />
        </div>
      <div
        className={cn(
          'common-container px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] flex-col',
          className
        )}
      >
        <h2 className="w-[80%] md:w-[20%] xxl:w-[30%] text-xl xl:text-2xl xxl:text-3xl font-semibold leading-[1.25]">
          <span>{rightPathSection.title}</span>
        </h2>
        <div className="w-full h-full [&>*]:w-full [&>*]:h-fit">
          <IllustrationRightRespondentsIcon className="hidden md:block" />
          <IllustrationRightRespondentsMIcon className="md:hidden" />
        </div>
      </div>
    </section>
  );
};

export default RightPathSection;
