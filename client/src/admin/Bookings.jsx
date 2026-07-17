import { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadBookings = () => {
    axios
      .get(
        "https://katinapinkamabookingsystem-production.up.railway.app/api/bookings/all"
      )
      .then((response) => {
        const sorted = response.data.sort(
          (a, b) => b.ID - a.ID
        );

        setBookings(sorted);
      })
      .catch((error) => {
        console.error("Error loading bookings:", error);
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleExport = () => {
    window.open(
      "https://katinapinkamabookingsystem-production.up.railway.app/api/export-bookings",
      "_blank"
    );
  };

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

  const formatCreatedAt = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB");
  };

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase();

    return (
      booking.ID?.toString().includes(search) ||
      booking.Name?.toLowerCase().includes(search) ||
      booking.Phone?.includes(search) ||
      booking.Whatsapp?.includes(search) ||
      booking.BookingType?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Bookings Management ({filteredBookings.length})
          </h1>
        </div>

        <button
          onClick={handleExport}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search by ID, Name, Phone, WhatsApp or Booking Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="text-left p-4">Booking ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">WhatsApp</th>
              <th className="text-left p-4">Booking Type</th>
              <th className="text-left p-4">Booking Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Booked On</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.ID}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{booking.ID}</td>
                  <td className="p-4">{booking.Name}</td>
                  <td className="p-4">{booking.Phone}</td>
                  <td className="p-4">{booking.Whatsapp}</td>

                  <td className="p-4">
                    {booking.BookingType || "-"}
                  </td>

                  <td className="p-4">
                    {formatBookingDate(
                      booking.BookingDate
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        booking.Status === "Cancelled"
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {booking.Status || "Active"}
                    </span>
                  </td>

                  <td className="p-4">
                    {formatCreatedAt(
                      booking.CreatedAt
                    )}
                  </td>

                  <td className="p-4">
                    {booking.Status ===
                    "Cancelled" ? (
                      <span className="text-gray-500">
                        Cancelled
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleCancelBooking(
                            booking.ID
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center p-6 text-gray-500"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}