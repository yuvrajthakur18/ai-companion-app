import React, { useState, useEffect } from "react";
import { createCompanion, getCompanions, converse } from "../services/api";

const CompanionForm = () => {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [language, setLanguage] = useState("English");
  const [companions, setCompanions] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");

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

  const handleCreate = async () => {
    try {
      await createCompanion({ name, personality, language });
      fetchCompanions();
    } catch (err) {
      alert("Failed to create companion");
    }
  };

  const handleConverse = async () => {
    if (!selectedId) return;
    try {
      const res = await converse(selectedId, message);
      alert(res.data.response);
    } catch (err) {
      alert("Conversation failed");
    }
  };

  return (
    <div>
      <h2>Create Companion</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input
        placeholder="Personality"
        onChange={(e) => setPersonality(e.target.value)}
      />
      <input
        placeholder="Language"
        onChange={(e) => setLanguage(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>

      <h2>Your Companions</h2>
      <ul>
        {companions.map((comp) => (
          <li key={comp.id}>
            {comp.name} - {comp.personality}
          </li>
        ))}
      </ul>

      <h2>Converse</h2>
      <select onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Select Companion</option>
        {companions.map((comp) => (
          <option key={comp.id} value={comp.id}>
            {comp.name}
          </option>
        ))}
      </select>
      <input
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleConverse}>Send</button>
    </div>
  );
};

export default CompanionForm;
