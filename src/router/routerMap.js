import { lazy } from 'react';
import { Navigate } from "react-router-dom";

const Home = lazy(() => import('@/pages/components/home'));
const Test = lazy(() => import('@/pages/components/test'));
const Test1 = lazy(() => import('@/pages/components/test1'));

const routeList = [
  { path: '/', element: <Navigate to={'/home'} /> },
  { path: '/home', element: <Home /> },
  { path: '/test', element: <Test /> },
  { path: '/test1', element: <Test1 /> },
];

export default routeList;
