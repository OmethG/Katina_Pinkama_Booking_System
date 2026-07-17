import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.jpeg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Samadhi Arana Logo"
            className="h-56 w-auto"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-7xl font-bold text-center mb-5 leading-tight">
          2026 වස්සාන කාළය
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-2xl leading-relaxed mb-12">
          නිවෙස් වල පවත්වන පින්කම් සදහා
          <br />
          දින වෙන් කරගැනීම.
        </p>

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
                වෙන්කිරීමේ විස්තර
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