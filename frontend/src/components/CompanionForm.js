import React, { useState, useEffect } from "react";
import { createCompanion, getCompanions, converse } from "../services/api";

const CompanionForm = () => {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [language, setLanguage] = useState("English");
  const [companions, setCompanions] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [response, setResponse] = useState(""); // For displaying converse response
  const [notification, setNotification] = useState({ text: "", type: "" }); // For create errors/success

  useEffect(() => {
    fetchCompanions();
  }, []);

  const fetchCompanions = async () => {
    try {
      const res = await getCompanions();
      setCompanions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => setNotification({ text: "", type: "" }), 3000);
  };

  const handleCreate = async () => {
    try {
      await createCompanion({ name, personality, language });
      fetchCompanions();
      setName("");
      setPersonality("");
      setLanguage("English");
      showNotification("Companion created successfully!", "success");
    } catch (err) {
      showNotification(
        "Failed to create companion. Please try again.",
        "error"
      );
    }
  };

  const handleConverse = async () => {
    if (!selectedId) {
      showNotification("Please select a companion.", "error");
      return;
    }
    try {
      const res = await converse(selectedId, message);
      setResponse(res.data.response);
      setMessage(""); // Clear input after send
    } catch (err) {
      setResponse("Conversation failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification.text && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-md max-w-md mx-auto ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-400 text-green-700"
              : "bg-red-50 border-l-4 border-red-400 text-red-700"
          }`}
        >
          {notification.text}
        </div>
      )}

      {/* Create Companion Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create a New Companion
        </h2>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Personality (e.g., friendly, witty)"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
            />
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Create Companion
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Companions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Companions
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {companions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No companions yet. Create one above!
              </p>
            ) : (
              <ul className="space-y-3">
                {companions.map((comp) => (
                  <li
                    key={comp.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <span className="font-medium text-gray-900">
                      {comp.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {comp.personality}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Converse Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Converse with a Companion
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
            <select
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a Companion</option>
              {companions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleConverse}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Send Message
            </button>
            {response && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md">
                <p className="text-gray-800 italic">Companion: {response}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionForm;
