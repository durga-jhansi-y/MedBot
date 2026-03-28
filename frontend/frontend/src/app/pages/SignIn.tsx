import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getProfiles } from "../../lib/api";
import { useUser } from "../context/UserContext";
import { NavigationBar } from "../components/NavigationBar";
import { RacingBackground } from "../components/RacingBackground";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { LogIn, Plus, AlertCircle, Flag, Zap } from "lucide-react";

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

  const pageDescription = "Sign in with an existing profile or create a new one.";

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <RacingBackground />
      <ChatbotWidget />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flag className="size-8 text-orange-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Sign In
              </h1>
              <Flag className="size-8 text-orange-600" />
            </div>
            <p className="text-gray-600 text-lg">
              {pageDescription}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin mb-4 inline-block">
                <Zap className="size-12 text-orange-600" />
              </div>
              <p className="text-gray-600">Loading profiles…</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="pt-6 flex items-start gap-3">
                <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-800 font-semibold">Error Loading Profiles</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Profiles State */}
          {!loading && profiles.length === 0 && !error && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle>No Profiles Found</CardTitle>
                <CardDescription>
                  Let's create your first profile to get started!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/create-account")}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="size-4 mr-2" />
                  Create New Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Profiles List */}
          {!loading && profiles.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profiles.map((p) => (
                  <Card
                    key={p.name}
                    className="border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl text-orange-700">
                            {p.name}
                          </CardTitle>
                          {p.age && (
                            <p className="text-sm text-gray-600 mt-1">Age: {p.age}</p>
                          )}
                        </div>
                        <Zap className="size-8 fill-orange-500 text-orange-500 flex-shrink-0" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Blood Type */}
                      {p.bloodType && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Blood Type
                          </p>
                          <p className="text-sm text-gray-800">{p.bloodType}</p>
                        </div>
                      )}

                      {/* Medical Conditions */}
                      {p.medicalConditions && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Medical Conditions
                          </p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {p.medicalConditions}
                          </p>
                        </div>
                      )}

                      {/* Allergies */}
                      {p.allergies && p.allergies.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                            Allergies
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {p.allergies.map((allergy: string) => (
                              <Badge
                                key={allergy}
                                variant="secondary"
                                className="bg-red-100 text-red-700 border-red-300"
                              >
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Emergency Contact */}
                      {p.emergencyContact && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Emergency Contact
                          </p>
                          <p className="text-sm text-gray-800">{p.emergencyContact}</p>
                          {p.emergencyPhone && (
                            <p className="text-sm text-gray-600">{p.emergencyPhone}</p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-orange-100">
                        <Button
                          onClick={() => handleUseProfile(p)}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                          <LogIn className="size-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create New Profile Button */}
              <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
                <CardContent className="pt-6">
                  <Button
                    onClick={() => navigate("/create-account")}
                    variant="outline"
                    className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Plus className="size-4 mr-2" />
                    Create New Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
