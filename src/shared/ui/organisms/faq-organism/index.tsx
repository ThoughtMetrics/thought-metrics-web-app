import { cn } from '@/core/utils/cn';
import { useState } from 'react';

const FaqOrganism: React.FC<any> = ({ data }) => {
  const [expandedItems, setExpandedItems] = useState<number>();

  const toggleExpand = (index: any) => {
    if (expandedItems === index) {
      setExpandedItems(undefined);
    } else {
      setExpandedItems(index);
    }
  };
  return (
    <div className="w-full flex flex-col">
      {data.map(
        (
          { question, answer }: { question: string; answer: string },
          index: number
        ) => (
          <div
            className="w-full flex flex-col cursor-pointer border-b-[1px] border-custom-grey-2 py-3"
            key={index + question}
            onClick={() => toggleExpand(index)}
          >
            <div className="flex justify-between">
              <label className="w-[80%] md:w-full md:text-xl cursor-pointer">
                {question}
              </label>
              <div className="w-6 h-6">
                <div className="w-full h-full relative">
                  <line className="absolute top-1/2 transform -translate-1/2 w-full h-0.25 bg-black transition-all duration-300" />
                  <line
                    className={cn(
                      'absolute top-1/2 transform -translate-1/2 h-full w-0.25 bg-black transition-all duration-300',
                      expandedItems === index
                        ? 'opacity-0 rotate-90'
                        : 'opacity-100 rotate-0'
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Answer section with smooth transition */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedItems === index
                  ? 'max-h-96 opacity-100 pb-3'
                  : 'max-h-0 opacity-0 pb-0'
              }`}
            >
              <div className="pr-6 pt-8 pb-2">
                <div className="text-sm text-black whitespace-pre-line">
                  {answer}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FaqOrganism;
