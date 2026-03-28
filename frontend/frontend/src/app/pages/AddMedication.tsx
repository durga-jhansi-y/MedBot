import { useState } from "react";
import { Upload, Plus, X, Flag } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { NavigationBar } from "../components/NavigationBar";
import { RacingBackground } from "../components/RacingBackground";
import { TextToSpeech } from "../components/TextToSpeech";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { addMedication, uploadPrescription } from "../../lib/api";

interface MedicationForm {
  name: string;
  dosage: string;
  daysToTake: string[];
  timesPerDay: Record<string, string>; // day -> time mapping
  refillDays: string;
  instructions: string;
}

const initialFormState: MedicationForm = {
  name: "",
  dosage: "",
  daysToTake: [],
  timesPerDay: {},
  refillDays: "",
  instructions: "",
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AddMedication() {
  const navigate = useNavigate();
  const [form, setForm] = useState<MedicationForm>(initialFormState);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sameTimeForAll, setSameTimeForAll] = useState(false);

  const handleInputChange = (field: keyof MedicationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayToggle = (day: string) => {
    setForm((prev) => {
      const isRemoving = prev.daysToTake.includes(day);
      const newDaysToTake = isRemoving
        ? prev.daysToTake.filter((d) => d !== day)
        : [...prev.daysToTake, day];
      
      // Remove time entry if day is unchecked
      const newTimesPerDay = { ...prev.timesPerDay };
      if (isRemoving) {
        delete newTimesPerDay[day];
      }
      
      return {
        ...prev,
        daysToTake: newDaysToTake,
        timesPerDay: newTimesPerDay,
      };
    });
  };

  const handleTimeChange = (day: string, time: string) => {
    setForm((prev) => ({
      ...prev,
      timesPerDay: {
        ...prev.timesPerDay,
        [day]: time,
      },
    }));

    // If "same time for all" is enabled, update all selected days
    if (sameTimeForAll) {
      setForm((prev) => {
        const updatedTimes: Record<string, string> = {};
        prev.daysToTake.forEach((d) => {
          updatedTimes[d] = time;
        });
        return {
          ...prev,
          timesPerDay: updatedTimes,
        };
      });
    }
  };

  const handleSameTimeToggle = (checked: boolean) => {
    setSameTimeForAll(checked);
    
    // If enabling, auto-fill all days with the first time entry found
    if (checked) {
      const firstTime = Object.values(form.timesPerDay).find((t) => t) || "";
      if (firstTime) {
        const updatedTimes: Record<string, string> = {};
        form.daysToTake.forEach((day) => {
          updatedTimes[day] = firstTime;
        });
        setForm((prev) => ({
          ...prev,
          timesPerDay: updatedTimes,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.name || !form.dosage) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addMedication(form);
      toast.success("Medication added successfully! 🏁", {
        description: "Your medication has been added to your dashboard.",
      });

      // Reset form
      setForm(initialFormState);
      setSameTimeForAll(false);

      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Add medication error:", err);
      toast.error("Failed to add medication. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // In a real app, this would parse the file and extract medication info
      toast.success("File uploaded successfully! 🏁", {
        description: `${file.name} is ready to be processed.`,
      });
      
      // Simulate file processing
      console.log("File uploaded:", file.name);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const pageDescription = "Add your medication details manually or upload a prescription file. We'll help you stay on track!";

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <RacingBackground />
      <ChatbotWidget />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flag className="size-8 text-orange-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Add Medication
              </h1>
              <Flag className="size-8 text-orange-600" />
              <TextToSpeech text={pageDescription} />
            </div>
            <p className="text-gray-600">
              {pageDescription}
            </p>
          </div>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual" className="gap-2">
                <Plus className="size-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="size-4" />
                Upload File
              </TabsTrigger>
            </TabsList>

            {/* Manual Entry Tab */}
            <TabsContent value="manual">
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle>Enter Medication Details</CardTitle>
                  <CardDescription>
                    Fill in the information below. Required fields are marked with *
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Prescription Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Lisinopril"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dosage">
                        Dosage *
                      </Label>
                      <Input
                        id="dosage"
                        placeholder="e.g., 10mg"
                        value={form.dosage}
                        onChange={(e) => handleInputChange("dosage", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>
                          Days to Take
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {DAYS_OF_WEEK.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={form.daysToTake.includes(day)}
                                onCheckedChange={() => handleDayToggle(day)}
                              />
                              <label
                                htmlFor={day}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Show "same time for all" toggle when at least one day is selected */}
                      {form.daysToTake.length > 1 && (
                        <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <Checkbox
                            id="sameTimeForAll"
                            checked={sameTimeForAll}
                            onCheckedChange={(checked) => handleSameTimeToggle(checked as boolean)}
                          />
                          <label
                            htmlFor="sameTimeForAll"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Same time for all days
                          </label>
                        </div>
                      )}

                      {/* Show individual time inputs for each selected day */}
                      {form.daysToTake.length > 0 && (
                        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <Label className="text-base">Time for Each Day</Label>
                          {form.daysToTake.map((day) => (
                            <div key={day} className="flex items-center gap-3">
                              <Label htmlFor={`time-${day}`} className="w-28 text-sm">
                                {day}:
                              </Label>
                              <Input
                                id={`time-${day}`}
                                type="time"
                                value={form.timesPerDay[day] || ""}
                                onChange={(e) => handleTimeChange(day, e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="refillDays">
                        Days Until Refill Needed
                      </Label>
                      <Input
                        id="refillDays"
                        type="number"
                        placeholder="e.g., 30"
                        value={form.refillDays}
                        onChange={(e) => handleInputChange("refillDays", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">
                        Special Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Take with food, avoid grapefruit"
                        value={form.instructions}
                        onChange={(e) => handleInputChange("instructions", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        <Plus className="size-4 mr-2" />
                        Add Medication
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setForm(initialFormState)}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="upload">
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle>Upload Prescription File</CardTitle>
                  <CardDescription>
                    Upload a file containing your medication information (PDF, Image, or Text)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!uploadedFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="size-12 text-orange-500 mb-4" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, PNG, JPG or TXT (MAX. 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.txt"
                          onChange={handleFileUpload}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Upload className="size-8 text-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-600">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="size-5" />
                        </Button>
                      </div>
                    )}

                    {uploadedFile && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Your file will be processed by our backend
                            system to extract medication information. This is a frontend demo,
                            so the actual processing will happen when connected to the backend.
                          </p>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          onClick={async () => {
                            if (!uploadedFile) return;
                            try {
                              await uploadPrescription(uploadedFile);
                              toast.success("File processing started! 🏁", {
                                description: "Your medication will appear on the dashboard soon.",
                              });
                              setTimeout(() => navigate("/dashboard"), 1500);
                            } catch (err) {
                              console.error("Upload error:", err);
                              toast.error("Failed to upload file. Please try again.");
                            }
                          }}
                        >
                          Process File
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}