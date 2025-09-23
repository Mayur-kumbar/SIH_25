import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { Signin } from "./pages/Signin";

import { Signup } from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App