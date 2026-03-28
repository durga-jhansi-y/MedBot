import { useEffect } from "react";
import { useNavigate } from "react-router";

export function EntryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const seen = localStorage.getItem("hasSeenSignIn");
      if (seen === "true") {
        navigate("/home", { replace: true });
      } else {
        navigate("/create-account", { replace: true });
      }
    } catch (e) {
      // Fallback to create-account on any storage errors
      navigate("/create-account", { replace: true });
    }
  }, [navigate]);

  return null;
}
