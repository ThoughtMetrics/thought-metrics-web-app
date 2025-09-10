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
import OurPanel from '@/pages/our-panel';
import AdvocateLandingPage from '@/pages/landing/advocate-landing';
import RespondentLandingPage from '@/pages/landing/respondent-landing';
import Careers from '@/pages/careers';
import ContactUs from '@/pages/contact-us';
import PrivacyPolicy from '@/pages/privacy-policy';
import BusinessConductEthics from '@/pages/business-conduct-ethics';
import AIPolicy from '@/pages/ai-policy';
import SiteDisclaimer from '@/pages/site-disclaimer';
import ResearchForm from '@/pages/start-your-research';
import ReportDownloadPage from '@/pages/report-download';
import LandingLayout from '@/shared/components/landing-layout';
import InteractionLayout from '@/shared/components/intraction-layout';
import AuthPage from '@/pages/auth';
import SignUpPage from '@/pages/auth/sign-up';
import UnsubscribePage from '@/pages/auth/unsubscribe';
import EditProfilePage from '@/pages/auth/edit-profile';
import ResourcePage from '@/pages/resources';
import SurveyPage from '@/pages/survey-page';

// // Home loader - prefetches blog data
// const homeLoader = async () => {
//   await queryClient.prefetchQuery({
//     queryKey: contentKeys.blog({
//       type: [ContentType.ARTICLE, ContentType.INSIGHT],
//       limit: 4,
//     }),
//     queryFn: () =>
//       contentService.getBlogContents({
//         type: [ContentType.ARTICLE, ContentType.INSIGHT],
//         limit: 4,
//       }),
//   });

//   return null;
// };

// // Resource loader - prefetches specific content
// const resourceLoader = async ({ params }: { params: any }) => {
//   if (!params.slug) return null;

//   const content = await queryClient.fetchQuery({
//     queryKey: contentKeys.slug(params.slug),
//     queryFn: () => contentService.getContentBySlug(params.slug),
//   });

//   return { content };
// };

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Static Content Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

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

        <Route path="capabilities" element={<CapabilitiesPage />}>
          <Route index element={<Navigate to="/capabilities" replace />} />
          <Route
            path="branding_advertising"
            element={<CapabilitiesBrandingAdvertisingPage />}
          />
          <Route
            path="market_opportunity"
            element={<CapabilitiesMarketOpportunityPage />}
          />
          <Route
            path="product_research"
            element={<CapabilitiesProductResearchPage />}
          />
          <Route
            path="customer_research"
            element={<CapabilitiesCustomerResearchPage />}
          />
        </Route>

        <Route path="research_methods" element={<ResearchMethodsPage />}>
          <Route index element={<Navigate to="/research_methods" replace />} />
          <Route
            path="quantitative_research"
            element={<ResearchMethodQuantitativeResearch />}
          />
          <Route
            path="qualitative_research"
            element={<ResearchMethodQualitativeResearch />}
          />
          <Route path="fieldwork" element={<ResearchMethodFieldwork />} />
          <Route path="focus_group" element={<ResearchMethodFocusGroup />} />
          <Route path="surveys" element={<ResearchMethodSurveys />} />
          <Route path="quality" element={<ResearchMethodQuality />} />
        </Route>

        <Route path="our_panel" element={<OurPanel />} />

        <Route path="resources/:slug" element={<ResourcePage />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact_us" element={<ContactUs />} />
        <Route path="site_disclaimer" element={<SiteDisclaimer />} />
        <Route path="privacy_policy" element={<PrivacyPolicy />} />
        <Route
          path="business_conduct_ethics"
          element={<BusinessConductEthics />}
        />
        <Route path="ai_policy" element={<AIPolicy />} />
        <Route path="start_your_research" element={<ResearchForm />} />
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Landing Content Routes */}
      <Route path="/" element={<LandingLayout />}>
        <Route path="respondent_landing" element={<RespondentLandingPage />} />
        <Route path="advocate_landing" element={<AdvocateLandingPage />} />
      </Route>

      {/* Design Content Routes */}
      <Route path="/">
        <Route path="report_download" element={<ReportDownloadPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Route>

      {/* Authed Content Routes */}
      <Route path="/" element={<InteractionLayout />}>
        <Route path="sign_up" element={<SignUpPage />} />
        <Route path="unsubscribe" element={<UnsubscribePage />} />
        <Route path="edit_profile" element={<EditProfilePage />} />
        <Route path="survey_page" element={<SurveyPage />} />
      </Route>
    </>
  )
);

export const goBack = () => {
  window.history.back();
};
