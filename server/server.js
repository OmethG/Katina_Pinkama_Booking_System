require("dotenv").config();

console.log("HOST =", process.env.MYSQLHOST);
console.log("USER =", process.env.MYSQLUSER);
console.log("DATABASE =", process.env.MYSQLDATABASE);

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
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
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

    const [databaseResult] = await connection.query(
      "SELECT DATABASE() AS db"
    );

    console.log("ACTIVE DATABASE:", databaseResult[0].db);

    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed");
    console.error(error);
  }
})();

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
    username === "admin@samadhiarana.com" &&
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
      BookingType,
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
        BookingType,
        BookingDate,
        Status,
        CreatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        Name,
        Whatsapp || null,
        Phone || null,
        0,
        BookingType || null,
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
// DELETE SELECTED CANCELLED BOOKINGS
// ==========================================

app.delete(
  "/api/bookings/delete-cancelled",
  async (req, res) => {
    try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No booking IDs provided",
        });
      }

      const placeholders = ids
        .map(() => "?")
        .join(",");

      await db.query(
        `
        DELETE FROM bookings
        WHERE ID IN (${placeholders})
        AND Status = 'Cancelled'
        `,
        ids
      );

      const [countRows] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM bookings
        `
      );

      if (countRows[0].total === 0) {
        await db.query(
          `
          ALTER TABLE bookings
          AUTO_INCREMENT = 1
          `
        );
      }

      res.json({
        success: true,
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

    const formatDate = (date) => {
      if (!date) return "";

      return new Date(date).toLocaleDateString(
        "en-GB"
      );
    };

    const formatDateTime = (date) => {
      if (!date) return "";

      return new Date(date).toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    };

    let csv =
      "ID,Name,Whatsapp,Phone,BookingTypeID,BookingType,BookingDate,Status,CreatedAt\n";

    rows.forEach((row) => {
      csv += `${row.ID},"${row.Name || ""}","${row.Whatsapp || ""}","${row.Phone || ""}",${row.BookingTypeID},"${row.BookingType || ""}","${formatDate(row.BookingDate)}","${row.Status || ""}","${formatDateTime(row.CreatedAt)}"\n`;
    });

    // UTF-8 BOM for Excel Sinhala support
    const csvWithBom = "\uFEFF" + csv;

    const now = new Date();

    const fileName = `bookings_${now
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-")}_${now
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(":", "-")}.csv`;

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.send(csvWithBom);
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