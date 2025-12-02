import React, { useState } from "react";
import Login from "./components/Login";
import CompanionForm from "./components/CompanionForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <h1>AI Companion App</h1>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <CompanionForm />
      )}
    </div>
  );
}

export default App;
