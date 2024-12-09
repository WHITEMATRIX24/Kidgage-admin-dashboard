import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTOp";
import Dashboard from "./components/dashboard";
import AdminSignIn from "./components/AdminSignIn";
import DashboardLayout from "./components/common/DashboardLayout";
import CalendarComponent from "./components/email";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </ScrollToTop>
  );
}

export default App;
