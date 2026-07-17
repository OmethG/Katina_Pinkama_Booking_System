import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookDate from "./pages/BookDate";
import ViewBooking from "./pages/ViewBooking";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Bookings from "./admin/Bookings";
import CalendarPage from "./admin/Calendar";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookDate />} />
        <Route
          path="/view-booking"
          element={<ViewBooking />}
        />

        {/* Admin Login */}
        <Route path="/admin" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;