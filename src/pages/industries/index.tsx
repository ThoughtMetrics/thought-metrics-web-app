import React from 'react';
import { Outlet, useLocation } from '';

const IndustriesPage: React.FC = () => {
  const location = useLocation();
  const isIndustriesRoot = location.pathname === '/industries';

  
  /* // Industry data for the grid
  const industries = [
    {
      id: 'advertising',
      title: 'Advertising and Media',
      description: 'Marketing insights and consumer behavior analysis',
      path: '/industries/advertising',
      icon: '📢',
      color: 'bg-blue-500',
    },
    {
      id: 'internet',
      title: 'Internet and Technology',
      description: 'Digital transformation and tech adoption research',
      path: '/industries/internet',
      icon: '💻',
      color: 'bg-purple-500',
    },
    {
      id: 'retail',
      title: 'Retail and E-commerce',
      description: 'Shopping behavior and retail trends',
      path: '/industries/retail',
      icon: '🛍️',
      color: 'bg-green-500',
    },
    {
      id: 'healthcare',
      title: 'Healthcare and Life Sciences',
      description: 'Patient insights and healthcare innovation',
      path: '/industries/healthcare',
      icon: '🏥',
      color: 'bg-red-500',
    },
    {
      id: 'hr',
      title: 'Human Resources',
      description: 'Employee experience and workplace research',
      path: '/industries/hr',
      icon: '👥',
      color: 'bg-orange-500',
    },
    {
      id: 'finance',
      title: 'Financial Services',
      description: 'Financial behavior and market research',
      path: '/industries/finance',
      icon: '💰',
      color: 'bg-yellow-500',
    },
    {
      id: 'automotive',
      title: 'Automotive',
      description: 'Vehicle preferences and mobility trends',
      path: '/industries/automotive',
      icon: '🚗',
      color: 'bg-indigo-500',
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Learning preferences and educational technology',
      path: '/industries/education',
      icon: '📚',
      color: 'bg-pink-500',
    },
    {
      id: 'fmcg',
      title: 'FMCG and Consumer Goods',
      description: 'Consumer preferences and product testing',
      path: '/industries/fmcg',
      icon: '🛒',
      color: 'bg-teal-500',
    },
    {
      id: 'investor',
      title: 'Investor Relations',
      description: 'Investor sentiment and market perception',
      path: '/industries/investor',
      icon: '📈',
      color: 'bg-gray-500',
    },
    {
      id: 'technology',
      title: 'Technology',
      description: 'Tech adoption and innovation insights',
      path: '/industries/technology',
      icon: '⚡',
      color: 'bg-cyan-500',
    },
  ]; */

  if (isIndustriesRoot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Industries We Serve
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover specialized research solutions tailored to your
              industries's unique challenges and opportunities. Our expert
              insights help drive informed decisions across diverse sectors.
            </p>
          </div>

          
          {/* Industries Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industries) => (
              <a
                key={industries.id}
                href={industries.path}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${industries.color} flex items-center justify-center text-white text-xl mr-4`}
                    >
                      {industries.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {industries.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {industries.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div> */}

          {/* CTA Section */}
          <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Don't See Your Industry?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We work across many more industries and can customize our research
              approach to meet your specific sector needs. Contact us to discuss
              your requirements.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary-dark transition-colors">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render nested industries page
  return (
    <div className="min-h-full">
      <Outlet />
    </div>
  );
};

export default IndustriesPage;
