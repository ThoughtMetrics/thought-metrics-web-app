import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const Investor: React.FC = () => {
  return <IndustryTemplatePage industry={industries.investor} featureCardClassName="md:pb-28"/>;
};

export default Investor;
