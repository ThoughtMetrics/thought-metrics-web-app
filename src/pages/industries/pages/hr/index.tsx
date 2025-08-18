import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const HR: React.FC = () => {
  return <IndustryTemplatePage industry={industries.hr} featureCardClassName="md:pb-28"/>;
};

export default HR;
