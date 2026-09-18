import { Routes, Route } from "react-router-dom";
import SceneBackground from "./components/SceneBackground.jsx";
import Welcome from "./pages/Welcome.jsx";
import FacultySelect from "./pages/FacultySelect.jsx";
import Signature from "./pages/Signature.jsx";
import Success from "./pages/Success.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <SceneBackground />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/select" element={<FacultySelect />} />
        <Route path="/signature/:id" element={<Signature />} />
        <Route path="/success/:id" element={<Success />} />
      </Routes>
    </div>
  );
}
