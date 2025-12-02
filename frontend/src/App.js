import React, { useState } from "react";
import Login from "./components/Login";
import CompanionForm from "./components/CompanionForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">AI Companion App</h1>
        </div>
      </header>
      <main className="flex-1">
        {!isLoggedIn ? (
          <Login onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <CompanionForm />
        )}
      </main>
    </div>
  );
}

export default App;
