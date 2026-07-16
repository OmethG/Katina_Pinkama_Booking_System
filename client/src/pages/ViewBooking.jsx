import { useState } from "react";
import axios from "axios";

export default function ViewBooking() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5001/api/bookings/search/${phone}`
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
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          View My Booking
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition"
          >
            Search
          </button>
        </div>

        {searched && bookings.length === 0 && (
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
                    <td className="p-4">{booking.BookingDate}</td>
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