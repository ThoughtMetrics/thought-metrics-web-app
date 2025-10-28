import FaqOrganism from "@/shared/ui/organisms/faq-organism";

const LandingQuestionarySection: React.FC<any> = ({
  questionarySection,
  faqId,
}) => {
  return (
    <section id={faqId} className="common-component text-black bg-white">
      <div className="common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 max-w-[1336px]! flex-col gap-3">
        <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-tight tracking-normal">
          {questionarySection.label}
        </h2>
        <FaqOrganism data={questionarySection.faqData} />
      </div>
    </section>
  );
};

export default LandingQuestionarySection;
