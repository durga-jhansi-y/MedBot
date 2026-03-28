import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserPlus, Flag, Zap, Plus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { RacingBackground } from "../components/RacingBackground";
import { TextToSpeech } from "../components/TextToSpeech";
import { useUser } from "../context/UserContext";
import { createProfile } from "../../lib/api";
import { toast } from "sonner";

export function CreateAccount() {
  const navigate = useNavigate();
  const { signIn } = useUser();

  // mark that the user has seen the sign-in/create-account page
  useEffect(() => {
    try {
      localStorage.setItem("hasSeenSignIn", "true");
    } catch (e) {
      // ignore storage errors
    }
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    medicalConditions: "",
    emergencyContact: "",
    emergencyPhone: "",
  });
  
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies((prev) => [...prev, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies((prev) => prev.filter((a) => a !== allergy));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create profile on the backend then sign in
    (async () => {
      try {
        const payload = { ...formData, allergies };
        const res = await createProfile(payload);
        const profile = res.data || res;
        signIn(profile);

        toast.success("Welcome to MedBot! 🏁", {
          description: "Your account has been created successfully.",
        });

        // Navigate to home
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (err: any) {
        toast.error(err?.message || "Failed to create profile");
      }
    })();
  };

  const pageDescription = "Create your MedBot account to get started with personalized medication reminders and health tracking.";

  return (
    <div className="min-h-screen">
      <RacingBackground />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Zap className="size-16 fill-orange-500 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 blur-xl">
                  <Zap className="size-16 fill-orange-500 text-orange-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flag className="size-8 text-orange-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Welcome to MedBot
              </h1>
              <Flag className="size-8 text-orange-600" />
              <TextToSpeech text={pageDescription} />
            </div>
            <p className="text-xl text-gray-700 mb-2">Have a Speedy Recovery!</p>
            <p className="text-gray-600">
              {pageDescription}
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-6 text-orange-600" />
                Create Your Account
              </CardTitle>
              <CardDescription>
                Tell us about yourself so we can provide personalized care. Required fields are marked with *
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Flag className="size-5 text-orange-600" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">
                        Age *
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodType">
                        Blood Type
                      </Label>
                      <Input
                        id="bloodType"
                        placeholder="e.g., A+, O-, AB+"
                        value={formData.bloodType}
                        onChange={(e) => handleInputChange("bloodType", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Flag className="size-5 text-orange-600" />
                    Medical Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">
                      Allergies
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="allergies"
                        placeholder="Add an allergy (e.g., Penicillin, Peanuts)"
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAllergy();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addAllergy}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {allergies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {allergies.map((allergy) => (
                          <Badge
                            key={allergy}
                            variant="secondary"
                            className="bg-red-100 text-red-800 border-red-300 pl-3 pr-1 py-1 flex items-center gap-2"
                          >
                            {allergy}
                            <button
                              type="button"
                              onClick={() => removeAllergy(allergy)}
                              className="hover:bg-red-200 rounded-full p-0.5"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">
                      Medical Conditions / Chronic Illnesses
                    </Label>
                    <Textarea
                      id="medicalConditions"
                      placeholder="e.g., Diabetes, Hypertension, Asthma"
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Flag className="size-5 text-orange-600" />
                    Emergency Contact
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact name"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">
                        Contact Phone
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="Phone number"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <UserPlus className="size-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Racing Motivation */}
          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 justify-center">
                <Flag className="size-6 text-red-600" />
                <p className="text-lg font-semibold text-gray-800">
                  Start your journey to better health management! 🏁
                </p>
                <Flag className="size-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
