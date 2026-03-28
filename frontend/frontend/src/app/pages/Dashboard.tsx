import { useState, useEffect } from "react";
import { Pill, Calendar, Clock, AlertCircle, Flag, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { NavigationBar } from "../components/NavigationBar";
import { RacingBackground } from "../components/RacingBackground";
import { TextToSpeech } from "../components/TextToSpeech";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Link } from "react-router";
import { api } from "../api";
import { useUser } from "../context/UserContext";

export function Dashboard() {
  const { user } = useUser();
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pageDescription = "Your medication dashboard. Track all your prescriptions and refill dates in one place.";

  useEffect(() => {
    const fetchMedications = async () => {
      if (user) {
        try {
          const data = await api.getMedications(user.name);
          const patientData = Array.isArray(data) ? data[0] : data;
          setMedications(patientData?.medications || []);
        } catch (error) {
          console.error("Failed to fetch medications:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  const getRefillStatus = (days: number) => {
    if (days <= 7) return { color: "text-red-600", bg: "bg-red-100", label: "Urgent" };
    if (days <= 14) return { color: "text-orange-600", bg: "bg-orange-100", label: "Soon" };
    return { color: "text-green-600", bg: "bg-green-100", label: "Good" };
  };

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <RacingBackground />
      <ChatbotWidget />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="size-8 text-orange-600 fill-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Your Medication Dashboard
            </h1>
            <Zap className="size-8 text-orange-600 fill-orange-600" />
            <TextToSpeech text={pageDescription} />
          </div>
          <p className="text-gray-600">{pageDescription}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Medications</p>
                  <p className="text-3xl font-bold text-orange-600">{medications.length}</p>
                </div>
                <Pill className="size-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Doses Today</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {medications.reduce((acc: number, med: any) => {
                      const freq = med.frequency?.toLowerCase() || "";
                      if (freq.includes("once")) return acc + 1;
                      if (freq.includes("twice")) return acc + 2;
                      if (freq.includes("three")) return acc + 3;
                      return acc + 1;
                    }, 0)}
                  </p>
                </div>
                <Clock className="size-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Refills Needed</p>
                  <p className="text-3xl font-bold text-red-600">
                    {medications.filter((med: any) => med.refillDays <= 7).length}
                  </p>
                </div>
                <AlertCircle className="size-12 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your medications...</p>
          </div>
        )}

        {/* Not signed in */}
        {!loading && !user && (
          <Card className="border-2 border-orange-200">
            <CardContent className="pt-6 text-center py-12">
              <Pill className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Please sign in to see your medications!</p>
              <Link to="/create-account">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Medications List */}
        {!loading && user && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Medications</h2>
              <Link to="/add-medication">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  Add New Medication
                </Button>
              </Link>
            </div>

            {medications.length === 0 ? (
              <Card className="border-2 border-orange-200">
                <CardContent className="pt-6 text-center py-12">
                  <Pill className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No medications added yet</p>
                  <Link to="/add-medication">
                    <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      Add Your First Medication
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              medications.map((med: any, index: number) => {
                const refillDays = med.refillDays || 30;
                const refillStatus = getRefillStatus(refillDays);
                const refillProgress = Math.max(0, ((30 - refillDays) / 30) * 100);

                return (
                  <Card key={index} className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                            <Pill className="size-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{med.name}</CardTitle>
                            <CardDescription className="text-base mt-1">
                              {med.dosage} • {med.frequency}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${refillStatus.bg} ${refillStatus.color} border-0`}>
                          {refillStatus.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {med.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              <strong>Duration:</strong> {med.duration}
                            </span>
                          </div>
                        )}
                        {med.times && (
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              <strong>Times:</strong> {med.times.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Refill Status</span>
                          <span className={`font-semibold ${refillStatus.color}`}>
                            {refillDays} days remaining
                          </span>
                        </div>
                        <Progress value={refillProgress} className="h-2" />
                      </div>

                      <div className="mt-4 flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Flag className="size-4 text-orange-600" />
                          <span className="text-sm font-semibold text-orange-800">
                            {med.frequency || "Daily"}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                          Mark as Taken
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 justify-center">
              <Flag className="size-6 text-red-600" />
              <p className="text-lg font-semibold text-gray-800">
                You're on the fast track to better health! Keep up the great work! 🏁
              </p>
              <Flag className="size-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}