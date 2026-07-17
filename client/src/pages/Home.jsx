import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-3">
          2026 වස්සාන කාළය
        </h1>

        <p className="text-center text-gray-700 mb-8 text-lg">
          නිවෙස් වල පවත්වන පින්කම් සදහා දින වෙන් කරගැනීම.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/book")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-2xl transition"
          >
            <div className="flex flex-col">
              <span>දින වෙන්කර ගැනීම</span>
              <span className="text-sm font-normal">
                Book a Date
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate("/view-booking")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4 rounded-2xl transition"
          >
            <div className="flex flex-col">
              <span>වෙන්කරවා ගැනීම බලන්න</span>
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