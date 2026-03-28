import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { AddMedication } from "./pages/AddMedication";
import { Dashboard } from "./pages/Dashboard";
import { CreateAccount } from "./pages/CreateAccount";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/create-account",
    Component: CreateAccount,
  },
  {
    path: "/add-medication",
    Component: AddMedication,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);