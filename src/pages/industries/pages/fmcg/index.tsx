import { industries } from '../../industries.constant';
import IndustryTemplatePage from '../../template';

const FMCG: React.FC = () => {
  return <IndustryTemplatePage industry={industries.fmcg} featureCardClassName="md:pb-28" />;
};

export default FMCG;
