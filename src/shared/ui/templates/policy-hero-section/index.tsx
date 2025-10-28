import React from 'react';
import '../../../../styles/markdown.css';
import MarkDownOrganism from '../../organisms/markdown-organism';

const PolicyHeroSection: React.FC<{ content: string; head: string }> = ({
  content,
  head,
}) => {
  return (
    <section className="common-component">
      <div className="common-container flex-col items-center">
        <div className="policies-component w-full min-h-60 md:min-h-[480px] xxl:p-0 flex items-center justify-center relative">
          <div className="absolute inset-0 w-full h-full bg-primary/65 z-0" />
          <div className="common-container px-6 py-8 md:px-24 md:py-24 max-w-[1336px]! relative z-10">
            <h2 className="text-xl md:text-4xl font-semibold text-white">
              {head}
            </h2>
          </div>
        </div>
        <div className="common-container px-6 py-8 md:px-24 md:py-24 max-w-[1336px]! text-black">
          <MarkDownOrganism content={content} showTOC={false} />
        </div>
      </div>
    </section>
  );
};
export default PolicyHeroSection;
