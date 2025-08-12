// pages/NotFound/index.tsx
import { ROUTES } from '@/routes/routeConfig';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            viewTransition={true}
            to={ROUTES.HOME}
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-bold"
          >
            Go Home
          </Link>

          <div className="text-sm text-gray-500">
            <p>Or try one of these links:</p>
            <div className="mt-2 space-x-4">
              <Link
                viewTransition={true}
                to="/industries/fmcg"
                className="text-primary hover:underline"
              >
                FMCG
              </Link>
              <Link
                viewTransition={true}
                to="/industries/advertising"
                className="text-primary hover:underline"
              >
                Advertising
              </Link>
              <Link
                viewTransition={true}
                to="/industries/technology"
                className="text-primary hover:underline"
              >
                Technology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
