import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RacingBackground } from "../components/RacingBackground";
import { LogIn, UserPlus, Flag, Zap } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <RacingBackground />

      <main className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Zap className="size-24 fill-orange-500 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 blur-xl">
                  <Zap className="size-24 fill-orange-500 text-orange-500" />
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
            </div>

            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Your personal medication reminder assistant. Track your prescriptions,
              set up reminders, and get instant answers about your medications.
            </p>
          </div>

          {/* Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sign In Card */}
            <Card className="border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full">
                    <LogIn className="size-12 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">
                  Sign In
                </h2>
                <p className="text-gray-600 mb-6">
                  Choose from your existing profiles and jump right in
                </p>
                <Button
                  onClick={() => navigate("/sign-in")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  size="lg"
                >
                  <LogIn className="size-5 mr-2" />
                  Sign In
                </Button>
              </CardContent>
            </Card>

            {/* Create Account Card */}
            <Card className="border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full">
                    <UserPlus className="size-12 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">
                  Create Account
                </h2>
                <p className="text-gray-600 mb-6">
                  Create a new profile and get started with MedBot
                </p>
                <Button
                  onClick={() => navigate("/create-account")}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  size="lg"
                >
                  <UserPlus className="size-5 mr-2" />
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-500">
            Get started now and stay on top of your medication schedule
          </p>
        </div>
      </main>
    </div>
  );
}
