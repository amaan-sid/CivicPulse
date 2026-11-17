import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import ReportIssue from "../pages/ReportIssue";
import IssueDetail from "../pages/IssueDetail";
import NotFound, { RouteError } from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "report", element: <ReportIssue /> },
      { path: "issues/:id", element: <IssueDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
