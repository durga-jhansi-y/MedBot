import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { Button } from "../components/ui/button";

export function UserProfile() {
  const { user, signIn, signOut } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [bloodType, setBloodType] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAge(user.age || "");
      setAllergies((user.allergies || []).join(", "));
      setMedicalConditions(user.medicalConditions || "");
      setEmergencyContact(user.emergencyContact || "");
      setEmergencyPhone(user.emergencyPhone || "");
      setBloodType(user.bloodType || "");
    }
  }, [user]);

  const handleSave = () => {
    const profile = {
      name,
      age,
      allergies: allergies.split(",").map((a) => a.trim()).filter(Boolean),
      medicalConditions,
      emergencyContact,
      emergencyPhone,
      bloodType,
    };

    signIn(profile);
    navigate("/dashboard");
  };

  const handleChangeAccount = () => {
    signOut();
    navigate("/create-account");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/home");
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies (comma separated)</label>
          <input
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
          <textarea
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
          <input
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
          <input
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Type</label>
          <input
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave}>Save</Button>
          <Button variant="ghost" onClick={handleChangeAccount}>Change Account</Button>
          <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
