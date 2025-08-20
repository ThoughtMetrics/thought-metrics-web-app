const LandingQuestionarySection: React.FC<any> = ({ questionarySection }) => {
  return (
    <section className="common-component text-black bg-white">
      <div className="common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 !max-w-[1336px] flex-col gap-3">
        <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
          {questionarySection.label}
        </h2>
        <div className="w-full flex flex-col">
          {questionarySection.list.map((label: string, index: number) => (
            <div
              className="w-full flex items-center justify-between border-b-[1px] border-custom-grey-2 py-3"
              key={index + label}
            >
              <label className="w-[80%] md:w-full md:text-xl">{label}</label>
              <div className="w-6 h-6">
                <div className="w-full h-full relative">
                  <line className="absolute top-1/2 transform -translate-1/2 w-full h-0.25 bg-black" />
                  <line className="absolute top-1/2 transform -translate-1/2 h-full w-0.25 bg-black" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingQuestionarySection;
