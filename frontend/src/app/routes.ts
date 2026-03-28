import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { AddMedication } from "./pages/AddMedication";
import { Dashboard } from "./pages/Dashboard";
import { CreateAccount } from "./pages/CreateAccount";
import { UserProfile } from "./pages/UserProfile";
import { EntryRedirect } from "./pages/EntryRedirect";
import { ResetFirstTime } from "./pages/ResetFirstTime";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: EntryRedirect,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/create-account",
    Component: CreateAccount,
  },
  {
    path: "/reset-first-time",
    Component: ResetFirstTime,
  },
  {
    path: "/add-medication",
    Component: AddMedication,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/profile",
    Component: UserProfile,
  },
]);