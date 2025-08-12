// routes/AppRouter.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';

// Layout Components

// Pages
import Home from '@/pages/home';
import IndustriesPage from '@/pages/industries';
import Advertising from '@/pages/industries/pages/advertising';
import Internet from '@/pages/industries/pages/internet';
import Retail from '@/pages/industries/pages/retail';
import Healthcare from '@/pages/industries/pages/healthcare';
import HR from '@/pages/industries/pages/hr';
import Finance from '@/pages/industries/pages/finance';
import Automotive from '@/pages/industries/pages/automotive';
import Education from '@/pages/industries/pages/education';
import FMCG from '@/pages/industries/pages/fmcg';
import Investor from '@/pages/industries/pages/investor';
import Technology from '@/pages/industries/pages/technology';
import Layout from '@/shared/components/layout';
import NotFound from '@/pages/not-found';
import CapabilitiesBrandingAdvertisingPage from '@/pages/capabilities/pages/branding-advertising';
import CapabilitiesCustomerResearchPage from '@/pages/capabilities/pages/customer-research';
import CapabilitiesMarketOpportunityPage from '@/pages/capabilities/pages/market-opportunity';
import CapabilitiesProductResearchPage from '@/pages/capabilities/pages/product-research';
import CapabilitiesPage from '@/pages/capabilities';
import ResearchMethodsPage from '@/pages/research-methods';
import ResearchMethodQuantitativeResearch from '@/pages/research-methods/pages/quantitative-research';
import ResearchMethodQualitativeResearch from '@/pages/research-methods/pages/qualitative-research';
import ResearchMethodFieldwork from '@/pages/research-methods/pages/fieldwork';
import ResearchMethodFocusGroup from '@/pages/research-methods/pages/focus-group';
import ResearchMethodSurveys from '@/pages/research-methods/pages/surveys';
import ResearchMethodQuality from '@/pages/research-methods/pages/quality';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Home Route */}
      <Route index element={<Home />} />

      {/* Industries Routes with Nested Structure */}
      <Route path="industries" element={<IndustriesPage />}>
        <Route index element={<Navigate to="/industries" replace />} />
        <Route path="advertising_marketing" element={<Advertising />} />
        <Route path="internet" element={<Internet />} />
        <Route path="retail" element={<Retail />} />
        <Route path="healthcare" element={<Healthcare />} />
        <Route path="hr" element={<HR />} />
        <Route path="finance" element={<Finance />} />
        <Route path="automotive" element={<Automotive />} />
        <Route path="education" element={<Education />} />
        <Route path="fmcg" element={<FMCG />} />
        <Route path="investor" element={<Investor />} />
        <Route path="technology" element={<Technology />} />
      </Route>

      {/* Capabilities Routes with Nested Structure */}
      <Route path="capabilities" element={<CapabilitiesPage />}>
        <Route index element={<Navigate to="/capabilities" replace />} />
        <Route path="branding_advertising" element={<CapabilitiesBrandingAdvertisingPage />} />
        <Route path="market_opportunity" element={<CapabilitiesMarketOpportunityPage />} />
        <Route path="product_research" element={<CapabilitiesProductResearchPage />} />
        <Route path="customer_research" element={<CapabilitiesCustomerResearchPage />} />
      </Route>

      {/* Research Methods Routes with Nested Structure */}
      <Route path="research_methods" element={<ResearchMethodsPage />}>
        <Route index element={<Navigate to="/research_methods" replace />} />
        <Route path="quantitative_research" element={<ResearchMethodQuantitativeResearch />} />
        <Route path="qualitative_research" element={<ResearchMethodQualitativeResearch />} />
        <Route path="fieldwork" element={<ResearchMethodFieldwork />} />
        <Route path="focus_group" element={<ResearchMethodFocusGroup />} />
        <Route path="surveys" element={<ResearchMethodSurveys />} />
        <Route path="quality" element={<ResearchMethodQuality />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export const goBack = () => {
  window.history.back();
};
