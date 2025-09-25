import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { Signin } from "./pages/Signin";

import { Signup } from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AllAchievementsPage from "./pages/AllAchievementsPage";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/facultyDashboard" element={<FacultyDashboard />} />
          <Route path="/allAchievements" element={<AllAchievementsPage />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App