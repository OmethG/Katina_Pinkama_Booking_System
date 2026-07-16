import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Katina Pinkama Booking
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/book")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-2xl transition"
          >
            Book a Date
          </button>

          <button
            onClick={() => navigate("/view-booking")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-2xl transition"
          >
            View My Booking
          </button>
        </div>
      </div>
    </div>
  );
}