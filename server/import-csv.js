require("dotenv").config();

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
});

async function importCSV() {
  const rows = [];

  fs.createReadStream(
    path.join(__dirname, "data", "bookings.csv")
  )
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      try {
        for (const row of rows) {
          console.log(
            "Processing:",
            row.ID,
            row.BookingDate
          );

          const bookingDate = new Date(row.BookingDate);

          if (isNaN(bookingDate.getTime())) {
            console.log(
              "❌ Invalid BookingDate:",
              row.ID,
              row.BookingDate
            );
            continue;
          }

          let createdAt = null;

          if (row.CreatedAt) {
            const createdDate = new Date(row.CreatedAt);

            if (!isNaN(createdDate.getTime())) {
              createdAt = createdDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            }
          }

          await db.query(
            `
            INSERT IGNORE INTO bookings
            (
              ID,
              Name,
              Whatsapp,
              Phone,
              BookingTypeID,
              BookingDate,
              CreatedAt,
              Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              Number(row.ID),
              row.Name,
              row.Whatsapp || null,
              row.Phone || null,
              Number(row.BookingTypeID || 0),
              bookingDate
                .toISOString()
                .split("T")[0],
              createdAt,
              "Active",
            ]
          );
        }

        const [count] = await db.query(
          "SELECT COUNT(*) AS total FROM bookings"
        );

        console.log(
          `✅ Imported ${rows.length} rows`
        );

        console.log(
          `✅ Database now contains ${count[0].total} bookings`
        );

        process.exit(0);
      } catch (error) {
        console.error("❌ Import failed");
        console.error(error);
        process.exit(1);
      }
    });
}

importCSV();