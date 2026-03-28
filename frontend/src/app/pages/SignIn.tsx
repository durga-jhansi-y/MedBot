import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { getProfiles } from "../../lib/api";
import { useUser } from "../context/UserContext";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useUser();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfiles();
        setProfiles(data || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load profiles");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUseProfile = (p: any) => {
    signIn(p);
    navigate("/home");
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose an existing profile or create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading profiles…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && profiles.length === 0 && (
              <div className="space-y-4">
                <p>No profiles found.</p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/create-account")}>Create New Profile</Button>
                </div>
              </div>
            )}

            {!loading && profiles.length > 0 && (
              <div className="space-y-4">
                {profiles.map((p) => (
                  <div key={p.name} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">{p.medicalConditions || "No medical conditions"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUseProfile(p)}>Use Profile</Button>
                      <Button variant="secondary" onClick={() => navigate("/create-account")}>Create New</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
