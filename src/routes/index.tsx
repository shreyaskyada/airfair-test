import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import LayoutUI from '../layout';
import Loader from '../components/Modals/Loader';
import AboutUs from '../pages/AboutUs';
// import FlightDetailPage from '../pages/FlightDetailPage';
// import PrivacyPolicy from '../pages/PrivacyPolicy';
// import TermsAndConditions from '../pages/TermsAndConditions';

const FlightDetailPage = lazy(() => import('../pages/FlightDetailPage'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const HomeScreen = lazy(() => import('../pages/Homepage'));
// const AboutUs = lazy(() => import('../pages/AboutUs'));
const FlightsListingPage = lazy(() => import('../pages/FlightsListingPage'));
  
export interface RouteType {
  path?: string;
  component: JSX.Element;
  index?: boolean;
  childRoutes?: RouteType[];
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
