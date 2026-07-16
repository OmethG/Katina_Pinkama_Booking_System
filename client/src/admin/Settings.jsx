import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    templeName: "Samadhi Arana",
    adminEmail: "admin@samadhiarana.com",
    contactNumber: "+971501234567",
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-white rounded-2xl shadow p-8 max-w-2xl">
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Temple Name
          </label>

          <input
            type="text"
            name="templeName"
            value={settings.templeName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Admin Email
          </label>

          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium">
            Contact Number
          </label>

          <input
            type="text"
            name="contactNumber"
            value={settings.contactNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}