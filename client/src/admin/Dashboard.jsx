import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Calendar,
  Settings,
  UserCog,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://katinapinkamabookingsystem-production.up.railway.app/api/bookings"
      )
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error loading bookings:", error);
      });
  }, []);

  const totalBookings = bookings.length;

  const currentDate = new Date();

  const currentMonthBookings = bookings.filter((booking) => {
    if (!booking.BookingDate) return false;

    const bookingDate = new Date(booking.BookingDate);

    return (
      bookingDate.getMonth() === currentDate.getMonth() &&
      bookingDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.BookingDate) return false;

    const bookingDate = new Date(booking.BookingDate);

    return bookingDate >= currentDate;
  }).length;

  const latestBookings = [...bookings]
    .sort((a, b) => b.ID - a.ID)
    .slice(0, 5);

  const formatBookingDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-orange-500">
            Samadhi Arana
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500 text-white rounded-xl"
          >
            <Users size={20} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/bookings")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
          >
            <Calendar size={20} />
            Bookings
          </button>

          <button
            onClick={() => navigate("/admin/calendar")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
          >
            <Calendar size={20} />
            Calendar
          </button>

          <button
            onClick={() => navigate("/admin/staff")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
          >
            <UserCog size={20} />
            Staff
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
          >
            <Settings size={20} />
            Settings
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">
          Dashboard
        </h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm">
              Total Bookings
            </h3>

            <p className="text-4xl font-bold text-orange-500 mt-2">
              {totalBookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm">
              This Month
            </h3>

            <p className="text-4xl font-bold text-green-500 mt-2">
              {currentMonthBookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm">
              Upcoming Bookings
            </h3>

            <p className="text-4xl font-bold text-blue-500 mt-2">
              {upcomingBookings}
            </p>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Latest 5 Bookings
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-2">
                    Booking ID
                  </th>

                  <th className="text-left py-3 px-2">
                    Name
                  </th>

                  <th className="text-left py-3 px-2">
                    Phone
                  </th>

                  <th className="text-left py-3 px-2">
                    Booking Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {latestBookings.map((booking) => (
                  <tr
                    key={booking.ID}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      {booking.ID}
                    </td>

                    <td className="py-3 px-2">
                      {booking.Name}
                    </td>

                    <td className="py-3 px-2">
                      {booking.Phone}
                    </td>

                    <td className="py-3 px-2">
                      {formatBookingDate(
                        booking.BookingDate
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Loading bookings...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}