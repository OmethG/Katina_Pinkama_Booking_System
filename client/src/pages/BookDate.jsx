import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookDate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/booked-dates")
      .then((response) => {
        setBookedDates(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const isBookedDate = (date) => {
    return bookedDates.includes(formatDate(date));
  };

  const minDate = new Date("2026-07-27");
  const maxDate = new Date("2026-10-24");

  const isValidUAEPhone = (number) => {
    const regex =
      /^(?:\+971|971|0)(50|52|54|55|56|58)\d{7}$/;

    return regex.test(number);
  };

  const isValidFullName = (fullName) => {
    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return parts.length >= 2;
  };

  const isNameValid =
    name.trim() === "" ? true : isValidFullName(name);

  const isPhoneValid =
    phone.trim() === "" ? true : isValidUAEPhone(phone);

  const isWhatsappValid =
    whatsapp.trim() === ""
      ? true
      : isValidUAEPhone(whatsapp);

  const canBook =
    isValidFullName(name) &&
    isValidUAEPhone(phone) &&
    isValidUAEPhone(whatsapp) &&
    selectedDate;

  const handleBooking = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/bookings",
        {
          Name: name,
          Phone: phone,
          Whatsapp: whatsapp,
          BookingDate: formatDate(selectedDate),
        }
      );

      alert(
        `Booking Successful!\nReference No: ${response.data.id}`
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        alert("This date has already been booked.");
      } else {
        alert("Booking failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3] p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <p className="mb-6 text-sm text-gray-500">
          Home / Booking
        </p>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            {!isNameValid && (
              <p className="text-red-500 text-sm mt-1">
                Please enter first name and last name.
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              placeholder="0501234567 or +971501234567"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            {!isPhoneValid && (
              <p className="text-red-500 text-sm mt-1">
                Invalid UAE phone number.
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              WhatsApp Number
            </label>

            <input
              type="text"
              placeholder="0501234567 or +971501234567"
              value={whatsapp}
              onChange={(e) =>
                setWhatsapp(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            {!isWhatsappValid && (
              <p className="text-red-500 text-sm mt-1">
                Invalid UAE WhatsApp number.
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
          <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              showNeighboringMonth={false}
              tileDisabled={({ date }) =>
                bookedDates.includes(formatDate(date))
              }
            />
          </div>

          <div className="text-sm text-gray-600">
            Booking Period:
            <strong>
              {" "}
              27 July 2026 - 24 October 2026
            </strong>
          </div>

          <button
            onClick={handleBooking}
            disabled={!canBook}
            className={`w-full py-4 rounded-xl text-white font-semibold ${
              canBook
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Book Date
          </button>
        </div>
      </div>
    </div>
  );
}