import { useEffect } from "react";
import { useNavigate } from "react-router";
import { resetOnboarding } from "../../lib/api";

export function ResetFirstTime() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        localStorage.removeItem("hasSeenSignIn");
      } catch (e) {
        // ignore
      }

      try {
        await resetOnboarding();
      } catch (e) {
        // it's okay if backend not available
      }

      // navigate to root which will run EntryRedirect
      navigate("/", { replace: true });
    })();
  }, [navigate]);

  return null;
}
