import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ViewBooking() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const isValidPhone = (number) => {
    const cleaned = number.replace(/\s+/g, "");

    const uaeRegex = /^\+971(50|52|54|55|56|58)\d{7}$/;
    const sriLankaRegex = /^\+947\d{8}$/;

    return uaeRegex.test(cleaned) || sriLankaRegex.test(cleaned);
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return "-";

    const [year, month, day] = dateString
      .split("T")[0]
      .split("-");

    return `${day}/${month}/${year}`;
  };

  const handleSearch = async () => {
    if (!phone.trim()) {
      setPhoneError("Please enter a phone number.");
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError(
        "Please enter a valid phone number starting with +971 or +94."
      );
      return;
    }

    setPhoneError("");

    try {
      const cleanedPhone = phone.replace(/\s+/g, "");

      const response = await axios.get(
        `https://katinapinkamabookingsystem-production.up.railway.app/api/bookings/search/${cleanedPhone}`
      );

      setBookings(response.data);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex justify-center items-start py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">
          View My Booking
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
            }}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition"
          >
            Search
          </button>
        </div>

        {phoneError && (
          <p className="text-red-500 text-sm mb-6">
            {phoneError}
          </p>
        )}

        {searched && bookings.length === 0 && !phoneError && (
          <div className="text-center text-red-500 font-medium text-lg">
            No booking found.
          </div>
        )}

        {bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="p-4 text-left">Booking ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">WhatsApp</th>
                  <th className="p-4 text-left">Booking Type</th>
                  <th className="p-4 text-left">Booking Date</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}