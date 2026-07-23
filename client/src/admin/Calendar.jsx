import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
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
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await axios.patch(
        `https://katinapinkamabookingsystem-production.up.railway.app/api/bookings/${bookingId}/cancel`
      );

      alert("Booking cancelled successfully.");
      loadBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking.");
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-GB");
  };

  const formatBookingTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-GB");
  };

  const selectedDateBookings = bookings.filter(
    (booking) => {
      if (!booking.BookingDate) return false;

      return (
        booking.BookingDate.split("T")[0] ===
        formatDate(date)
      );
    }
  );

  return (

<div className="min-h-screen bg-gray-100 p-8">
  <button
    onClick={() => navigate("/admin/dashboard")}
    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
  >
    <ArrowLeft size={20} />
    Back to Dashboard
  </button>

  <div className="mb-8">
    <h1 className="text-3xl font-bold">
      Calendar Management
    </h1>

    <p className="text-gray-500 mt-2">
      View and manage all booking dates
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-gray-500">
        Total Bookings
      </h3>

      <p className="text-3xl font-bold text-orange-500 mt-2">
        {bookings.length}
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-gray-500">
        Selected Date
      </h3>

      <p className="text-lg font-semibold mt-2">
        {date.toLocaleDateString("en-GB")}
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-gray-500">
        Bookings On Selected Date
      </h3>

      <p className="text-3xl font-bold text-orange-500 mt-2">
        {selectedDateBookings.length}
      </p>
    </div>
  </div>

  <div className="grid lg:grid-cols-2 gap-8">
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Booked</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-300"></span>
          <span>Today</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>Selected</span>
        </div>
      </div>

      <Calendar
        onChange={setDate}
        value={date}
        defaultActiveStartDate={new Date("2026-08-01")}
        minDate={new Date("2026-08-01")}
        maxDate={new Date("2026-10-25")}
        
        tileClassName={({ date }) => {
          const calendarDate = formatDate(date);

          const isBooked = bookings.some((booking) => {
            if (!booking.BookingDate) return false;

            return (
              booking.BookingDate.split("T")[0] ===
              calendarDate
            );
          });

          return isBooked ? "booked-date" : null;
        }}
        tileContent={({ date }) => {
          const calendarDate = formatDate(date);

          const count = bookings.filter((booking) => {
            if (!booking.BookingDate) return false;

            return (
              booking.BookingDate.split("T")[0] ===
              calendarDate
            );
          }).length;

          return (
            <div
              title={
                count > 0
                  ? `Date is booked (${count} booking${
                      count > 1 ? "s" : ""
                    })`
                  : "Date is available"
              }
              className="text-center"
            >
              {count > 0 && (
                <div className="text-red-500 text-[10px] font-bold">
                  ({count})
                </div>
              )}
            </div>
          );
        }}
      />
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Bookings for{" "}
        {date.toLocaleDateString("en-GB")}
      </h2>

      {selectedDateBookings.length > 0 ? (
        <div className="space-y-4">
          {selectedDateBookings.map((booking) => (
            <div
              key={booking.ID}
              className="border border-orange-200 rounded-xl p-5 hover:bg-orange-50"
            >
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">

                <p>
                  <strong>Booking ID:</strong>{" "}
                  {booking.ID}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.Status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {booking.Status || "Active"}
                  </span>
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {booking.Name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {booking.Phone}
                </p>

                <p>
                  <strong>WhatsApp:</strong>{" "}
                  {booking.Whatsapp}
                </p>

                <p>
                  <strong>Booking Type:</strong>{" "}
                  {booking.BookingType || "-"}
                </p>

                <p>
                  <strong>Booking Date:</strong>{" "}
                  {formatBookingDate(
                    booking.BookingDate
                  )}
                </p>

                <p>
                  <strong>Booked On:</strong>{" "}
                  {formatBookingTime(
                    booking.CreatedAt
                  )}
                </p>

              </div>

              <div className="mt-5 border-t pt-4">

                <h3 className="font-semibold text-gray-700 mb-3">
                  Address
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">

                  <p>
                    <strong>Villa / Apartment:</strong>{" "}
                    {booking.VillaApartmentNo || "-"}
                  </p>

                  <p>
                    <strong>Building / Street:</strong>{" "}
                    {booking.BuildingStreetNo || "-"}
                  </p>

                  <p>
                    <strong>Area:</strong>{" "}
                    {booking.Area || "-"}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {booking.City || "-"}
                  </p>

                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                {booking.GoogleMapsPin && (
                  <a
                    href={booking.GoogleMapsPin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Open Google Maps
                  </a>
                )}

                {booking.Status !== "Cancelled" && (
                  <button
                    onClick={() =>
                      handleCancelBooking(booking.ID)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel Booking
                  </button>
                )}

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">
          No bookings for this date.
        </div>
      )}
          </div>
  </div>
</div>
  );
}

            