import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import type React from 'react';
import '../../landing.style.css';

const LandingSignUpSection: React.FC<any> = ({ signUpSection }) => {
  return (
    <section className="common-component w-full h-full relative md:pt-0 landing-signup-section">
      <div className="absolute top-0 w-full h-full bg-primary/72" />
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] px-6 md:px-24 py-32 relative flex-col text-center gap-12">
        <h2 className="text-4xl font-medium">{signUpSection.label}</h2>
        <label className="text-xl font-medium">{signUpSection.description}</label>
        <CustomButtonAtom
          className="py-2 px-12 font-semibold text-lg xl:text-xl bg-secondary hover:bg-custom-blue"
          label={signUpSection.signButton.label}
        />
      </div>
    </section>
  );
};

export default LandingSignUpSection;
