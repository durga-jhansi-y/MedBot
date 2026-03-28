import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getProfile } from "../../lib/api";

export function EntryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Prefer server-side profile check when available
        const profile = await getProfile();
        if (profile && (profile.onboarded === true || profile.hasAccount === true)) {
          navigate("/home", { replace: true });
          return;
        }
      } catch (err) {
        // ignore and fallback to local storage
      }

      try {
        const seen = localStorage.getItem("hasSeenSignIn");
        if (seen === "true") {
          navigate("/home", { replace: true });
        } else {
          navigate("/welcome", { replace: true });
        }
      } catch (e) {
        // Fallback to welcome on any storage errors
        navigate("/welcome", { replace: true });
      }
    })();
  }, [navigate]);

  return null;
}
