import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routeList from "@/router/routerMap";

const Index = () => {
  const GetRoutes = () => {
    const routes = useRoutes(routeList);
    return routes;
  }
  return <div className="main-wrapper">
    <GetRoutes />
  </div>
};

export default Index;
