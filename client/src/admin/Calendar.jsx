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

  useEffect(() => {
    axios
      .get(
        "https://katinapinkamabookingsystem-production.up.railway.app/api/bookings"
      )
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // FIXED: No UTC conversion
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

  const selectedDateBookings = bookings.filter(
    (booking) => {
      if (!booking.BookingDate) return false;

      const bookingDate =
        booking.BookingDate.split("T")[0];

      return bookingDate === formatDate(date);
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
            tileClassName={({ date }) => {
              const calendarDate =
                formatDate(date);

              const isBooked =
                bookings.some((booking) => {
                  if (!booking.BookingDate)
                    return false;

                  return (
                    booking.BookingDate.split(
                      "T"
                    )[0] === calendarDate
                  );
                });

              return isBooked
                ? "booked-date"
                : null;
            }}
            tileContent={({ date }) => {
              const calendarDate =
                formatDate(date);

              const count =
                bookings.filter((booking) => {
                  if (!booking.BookingDate)
                    return false;

                  return (
                    booking.BookingDate.split(
                      "T"
                    )[0] === calendarDate
                  );
                }).length;

              return (
                <div
                  title={
                    count > 0
                      ? `Date is booked (${count} booking${
                          count > 1
                            ? "s"
                            : ""
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
              {selectedDateBookings.map(
                (booking) => (
                  <div
                    key={booking.ID}
                    className="border border-orange-200 rounded-xl p-4 hover:bg-orange-50"
                  >
                    <p>
                      <strong>ID:</strong>{" "}
                      {booking.ID}
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
                      <strong>
                        WhatsApp:
                      </strong>{" "}
                      {booking.Whatsapp}
                    </p>

                    <p>
                      <strong>
                        Booking Type:
                      </strong>{" "}
                      {booking.BookingType ||
                        "-"}
                    </p>

                    <p>
                      <strong>
                        Booking Date:
                      </strong>{" "}
                      {new Date(
                        booking.BookingDate
                      ).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>

                    <p>
                      <strong>
                        Booked On:
                      </strong>{" "}
                      {booking.CreatedAt
                        ? new Date(
                            booking.CreatedAt
                          ).toLocaleString(
                            "en-GB"
                          )
                        : "-"}
                    </p>
                  </div>
                )
              )}
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