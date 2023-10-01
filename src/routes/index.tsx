/**
 * @description React router dom routes wrapper | Defining all routes with common layout to setup router based screen management
 * @returns RoutesWrapper | Routes wrapper consisting of all routes with their child routes used for screen management
 */

import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import LayoutUI from '../layout';
import Loader from '../components/Modals/Loader';
import AboutUs from '../pages/AboutUs';
import FlightDetailPage from '../pages/FlightDetailPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';

const HomeScreen = lazy(() => import('../pages/Homepage'));
const FlightsListingPage = lazy(() => import('../pages/FlightsListingPage'));

export interface RouteType {
  path?: string;
  component: JSX.Element;
  index?: boolean;
  childRoutes?: RouteType[];
}

interface ProtectedRoutesType {
  allowedPermissions: any[];
  children: JSX.Element;
}

const routes = [
  {
    path: '/*',
    component: <LayoutUI />,
    index: false,
    childRoutes: [
      {
        path: 'flights-listing',
        component: <FlightsListingPage />,
        index: false,
      },
      {
        path: 'flights/:flight',
        component: <FlightDetailPage />,
        index: false,
      },
      { component: <HomeScreen />, index: true },
      { path: 'aboutUs', component: <AboutUs />, index: false },
      { path: 'privacy-policy', component: <PrivacyPolicy />, index: false },
      {
        path: 'terms-and-conditions',
        component: <TermsAndConditions />,
        index: false,
      },
    ],
  },
];

const RoutesWrapper = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, parentIndex) =>
        route.childRoutes?.length ? (
          <Route key={parentIndex} path={route.path} element={route.component}>
            {route.childRoutes.map((route, childIndex) => (
              <Route
                key={childIndex}
                path={route.path}
                element={route.component}
                index={route.index}
              />
            ))}
          </Route>
        ) : (
          <Route
            key={parentIndex}
            path={route.path}
            element={route.component}
            index={route.index}
          />
        )
      )}
    </Routes>
  </Suspense>
);

export default RoutesWrapper;
