import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Samadhi Arana Logo"
            className="h-32 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-4 leading-tight">
          2026 වස්සාන කාළය
        </h1>

        {/* Description */}
        <p className="text-center text-gray-700 mb-10 text-2xl leading-relaxed">
          නිවෙස් වල පවත්වන පින්කම් සදහා දින වෙන් කරගැනීම.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/book")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl transition"
          >
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                දින වෙන්කර ගැනීම
              </span>

              <span className="text-sm font-normal">
                Book a Date
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate("/view-booking")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl transition"
          >
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                වෙන්කරවා ගැනීම බලන්න
              </span>

              <span className="text-sm font-normal">
                View Booking
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}