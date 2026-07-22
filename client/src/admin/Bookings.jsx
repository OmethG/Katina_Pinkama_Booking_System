import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookings, setSelectedBookings] = useState([]);

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

  const handleCheckboxChange = (bookingId) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedBookings.length === 0) {
      alert(
        "Please select at least one cancelled booking."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedBookings.length} cancelled booking(s) permanently?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        "https://katinapinkamabookingsystem-production.up.railway.app/api/bookings/delete-cancelled",
        {
          data: {
            ids: selectedBookings,
          },
        }
      );

      alert("Selected bookings deleted.");

      setSelectedBookings([]);
      loadBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to delete bookings.");
    }
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB");
  };

  const formatBookingTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <button
        onClick={() =>
          navigate("/admin/dashboard")
        }
        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Bookings Management (
            {filteredBookings.length})
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl"
          >
            Delete Selected
          </button>

          <button
            onClick={handleExport}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search by ID, Name, Phone, WhatsApp or Booking Type..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="text-left p-4">
                Select
              </th>

              <th className="text-left p-4">
                Booking ID
              </th>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                WhatsApp
              </th>

              <th className="text-left p-4">
                Booking Type
              </th>

              <th className="text-left p-4">
                Booking Date
              </th>

              <th className="text-left p-4">
                Booking Time
              </th>

              <th className="text-left p-4 min-w-[320px]">
                Address
              </th>

              <th className="text-left p-4">
                Google Maps
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>
            </tr>
          </thead>
      <tbody>
  {filteredBookings.length > 0 ? (
    filteredBookings.map((booking) => (
      <tr
        key={booking.ID}
        className="border-b hover:bg-gray-50 align-top"
      >
        <td className="p-4">
          {booking.Status === "Cancelled" ? (
            <input
              type="checkbox"
              checked={selectedBookings.includes(
                booking.ID
              )}
              onChange={() =>
                handleCheckboxChange(booking.ID)
              }
            />
          ) : (
            "-"
          )}
        </td>

        <td className="p-4 font-semibold">
          {booking.ID}
        </td>

        <td className="p-4">
          {booking.Name}
        </td>

        <td className="p-4 whitespace-nowrap">
          {booking.Phone}
        </td>

        <td className="p-4 whitespace-nowrap">
          {booking.Whatsapp}
        </td>

        <td className="p-4 max-w-xs">
          {booking.BookingType || "-"}
        </td>

        <td className="p-4 whitespace-nowrap">
          {formatBookingDate(
            booking.BookingDate
          )}
        </td>

        <td className="p-4 whitespace-nowrap">
          {formatBookingTime(
            booking.CreatedAt
          )}
        </td>

        <td className="p-4">
          <div className="space-y-2 text-sm">

            <div>
              <span className="font-semibold">
                Villa / Apt:
              </span>{" "}
              {booking.VillaApartmentNo || "-"}
            </div>

            <div>
              <span className="font-semibold">
                Building / Street:
              </span>{" "}
              {booking.BuildingStreet || "-"}
            </div>

            <div>
              <span className="font-semibold">
                Area:
              </span>{" "}
              {booking.Area || "-"}
            </div>

            <div>
              <span className="font-semibold">
                City:
              </span>{" "}
              {booking.City || "-"}
            </div>
          </div>
        </td>

        <td className="p-4">
          {booking.GooglePin ? (
            <a
              href={booking.GooglePin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              Open Map
            </a>
          ) : (
            "-"
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
        colSpan="12"
        className="text-center p-8 text-gray-500"
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