import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const Education: React.FC = () => {
  return <IndustryTemplatePage industry={industries.education} featureCardClassName="md:pb-28"/>;
};

export default Education;
