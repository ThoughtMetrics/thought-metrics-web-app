import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const Technology: React.FC = () => {
  return <IndustryTemplatePage industry={industries.technology} featureCardClassName="md:pb-28"/>;
};

export default Technology;
