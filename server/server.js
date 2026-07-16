const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// MYSQL CONNECTION
// ==========================================

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "katina_pinkama_booking",
  waitForConnections: true,
  connectionLimit: 10,
});

// ==========================================
// TEST MYSQL CONNECTION
// ==========================================

(async () => {
  try {
    const connection = await db.getConnection();

    console.log("✅ MySQL Connected");
    console.log("DATABASE =", "katina_pinkama_booking");

    const [databaseResult] = await connection.query(
      "SELECT DATABASE() AS db"
    );

    console.log("ACTIVE DATABASE:", databaseResult[0].db);

    const [countResult] = await connection.query(
      "SELECT COUNT(*) AS total FROM bookings"
    );

    console.log("BOOKINGS COUNT:", countResult[0].total);

    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed");
    console.error(error);
  }
})();

// ==========================================

app.get("/", (req, res) => {
  res.send("Katina Pinkama Booking Backend Running");
});

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === "admin" &&
    password === "temple123"
  ) {
    return res.json({
      success: true,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// ==========================================
// GET ACTIVE BOOKINGS ONLY
// ==========================================

app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM bookings
      WHERE Status = 'Active'
      ORDER BY ID DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL BOOKINGS (INCLUDING CANCELLED)
// ==========================================

app.get("/api/bookings/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM bookings
      ORDER BY ID DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// GET BOOKED DATES
// ==========================================

app.get("/api/booked-dates", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT BookingDate
      FROM bookings
      WHERE Status = 'Active'
    `);

    const bookedDates = rows.map(
      (row) =>
        row.BookingDate
          .toISOString()
          .split("T")[0]
    );

    res.json(bookedDates);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// SEARCH ACTIVE BOOKINGS ONLY
// ==========================================

app.get("/api/bookings/search/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;

    const [rows] = await db.query(
      `
      SELECT *
      FROM bookings
      WHERE (Phone = ? OR Whatsapp = ?)
      AND Status = 'Active'
      ORDER BY ID DESC
      `,
      [phone, phone]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// CREATE BOOKING
// ==========================================

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      Name,
      Phone,
      Whatsapp,
      BookingDate,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO bookings
      (
        Name,
        Whatsapp,
        Phone,
        BookingTypeID,
        BookingDate,
        Status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        Name,
        Whatsapp || null,
        Phone || null,
        0,
        BookingDate,
        "Active",
      ]
    );

    res.json({
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================================
// CANCEL BOOKING
// ==========================================

app.patch(
  "/api/bookings/:id/cancel",
  async (req, res) => {
    try {
      const bookingId = req.params.id;

      const [result] = await db.query(
        `
        UPDATE bookings
        SET Status = 'Cancelled'
        WHERE ID = ?
        `,
        [bookingId]
      );

      res.json({
        success: true,
        affectedRows: result.affectedRows,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==========================================
// EXPORT BOOKINGS
// ==========================================

app.get("/api/export-bookings", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM bookings
      ORDER BY ID DESC
    `);

    let csv =
      "ID,Name,Whatsapp,Phone,BookingTypeID,BookingDate,Status,CreatedAt\n";

    rows.forEach((row) => {
      csv += `${row.ID},"${row.Name}","${row.Whatsapp || ""}","${row.Phone || ""}",${row.BookingTypeID},"${row.BookingDate.toISOString().split("T")[0]}","${row.Status}","${row.CreatedAt}"\n`;
    });

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bookings.csv"
    );

    res.send(csv);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================

app.listen(5001, () => {
  console.log("Server running on port 5001");
});