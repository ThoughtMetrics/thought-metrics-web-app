import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const Advertising: React.FC = () => {
  return <IndustryTemplatePage industry={industries.advertising} featureCardClassName="md:pb-28"/>;
};

export default Advertising;
