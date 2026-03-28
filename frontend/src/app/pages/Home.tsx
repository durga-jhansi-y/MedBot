import { Link } from "react-router";
import { Zap, Flag, Pill, Plus, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { NavigationBar } from "../components/NavigationBar";
import { RacingBackground } from "../components/RacingBackground";
import { TextToSpeech } from "../components/TextToSpeech";
import { ChatbotWidget } from "../components/ChatbotWidget";

export function Home() {
  const welcomeText = "Welcome to MedBot! Your personal medication reminder assistant. Have a speedy recovery!";

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <RacingBackground />
      <ChatbotWidget />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Zap className="size-20 fill-orange-500 text-orange-500 animate-pulse" />
              <div className="absolute inset-0 blur-xl">
                <Zap className="size-20 fill-orange-500 text-orange-500" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              MedBot
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Flag className="size-6 text-red-600" />
            <p className="text-2xl font-semibold text-gray-700">
              Have a Speedy Recovery!
            </p>
            <Flag className="size-6 text-red-600" />
            <TextToSpeech text={welcomeText} />
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal medication reminder assistant. Track your prescriptions,
            set up reminders, and get instant answers about your medications.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full">
                  <Plus className="size-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl">Add Medications</h3>
                <p className="text-gray-600">
                  Quickly input your prescriptions manually or upload a file with
                  all your medication details.
                </p>
                <Link to="/add-medication" className="mt-auto">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full">
                  <Pill className="size-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl">Track Progress</h3>
                <p className="text-gray-600">
                  View all your medications in one place, monitor refill dates,
                  and stay on track with your treatment.
                </p>
                <Link to="/dashboard" className="mt-auto">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Racing Theme Section */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <Trophy className="size-24 text-yellow-500 fill-yellow-400" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Race Towards Better Health
                </h2>
                <p className="text-gray-700 mb-4">
                  Just like a race car needs precise maintenance, your body needs
                  the right medications at the right time. MedBot keeps you in the
                  fast lane to recovery with timely reminders and expert guidance.
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Flag className="size-5 text-red-600" />
                  <span className="font-semibold text-orange-600">
                    Your pit crew for medication management!
                  </span>
                  <Flag className="size-5 text-red-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}