import { useEffect } from "react";
import { useNavigate } from "react-router";

export function ResetFirstTime() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem("hasSeenSignIn");
    } catch (e) {
      // ignore
    }
    // navigate to root which will run EntryRedirect
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
