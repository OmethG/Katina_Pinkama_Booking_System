const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mysql = require("mysql2/promise");

const app = express();

// MYSQL CONNECTION
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "samadhiarana",
  waitForConnections: true,
  connectionLimit: 10,
});

// TEST MYSQL CONNECTION
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed");
    console.error(error);
  }
})();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Samadhi Arana Backend Running");
});

// GET ALL BOOKINGS
app.get("/api/bookings", (req, res) => {
  const results = [];

  fs.createReadStream(
    path.join(__dirname, "data", "bookings.csv")
  )
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

// GET BOOKED DATES
app.get("/api/booked-dates", (req, res) => {
  const bookedDates = [];

  fs.createReadStream(
    path.join(__dirname, "data", "bookings.csv")
  )
    .pipe(csv())
    .on("data", (row) => {
      if (row.BookingDate) {
        bookedDates.push(row.BookingDate);
      }
    })
    .on("end", () => {
      res.json(bookedDates);
    })
    .on("error", (err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

// SEARCH BOOKING BY PHONE
app.get("/api/bookings/search/:phone", (req, res) => {
  const phone = req.params.phone;

  const bookings = [];

  fs.createReadStream(
    path.join(__dirname, "data", "bookings.csv")
  )
    .pipe(csv())
    .on("data", (row) => {
      bookings.push(row);
    })
    .on("end", () => {
      const result = bookings.filter(
        (booking) =>
          booking.Phone === phone ||
          booking.Whatsapp === phone
      );

      res.json(result);
    })
    .on("error", (err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

// EXPORT CSV
app.get("/api/export-bookings", (req, res) => {
  const filePath = path.join(
    __dirname,
    "data",
    "bookings.csv"
  );

  res.download(filePath, "bookings.csv");
});

// CREATE NEW BOOKING
app.post("/api/bookings", (req, res) => {
  const { Name, Phone, Whatsapp, BookingDate } = req.body;

  const bookings = [];

  fs.createReadStream(
    path.join(__dirname, "data", "bookings.csv")
  )
    .pipe(csv())
    .on("data", (row) => {
      bookings.push(row);
    })
    .on("end", () => {
      const lastId =
        bookings.length > 0
          ? Math.max(
              ...bookings.map((b) =>
                Number(b.ID || 0)
              )
            )
          : 0;

      const newId = lastId + 1;

      const createdAt = new Date().toISOString();

      const newRow =
        `\n${newId},"${Name}","${Whatsapp}","${Phone}",0,"${BookingDate}","${createdAt}"`;

      fs.appendFile(
        path.join(__dirname, "data", "bookings.csv"),
        newRow,
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: err.message,
            });
          }

          res.json({
            success: true,
            id: newId,
          });
        }
      );
    });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});