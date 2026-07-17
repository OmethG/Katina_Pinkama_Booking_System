import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.jpeg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Samadhi Arana Logo"
            className="h-72 w-auto"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold leading-tight">
            2026
          </h1>

          <h2 className="text-3xl font-semibold mt-2">
            වස්සාන කාළය
          </h2>

          <h2 className="text-3xl text-gray-500 font-normal leading-relaxed mt-4">
            නිවෙස් වල පවත්වන පින්කම් සදහා
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">

          <button
            onClick={() => navigate("/book")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">
                දින වෙන්කර ගැනීම
              </span>

              <span className="text-base font-normal mt-1">
                Book a Date
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate("/view-booking")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">
                වෙන්කරවා ගැනීම බලන්න
              </span>

              <span className="text-base font-normal mt-1">
                View Booking
              </span>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}