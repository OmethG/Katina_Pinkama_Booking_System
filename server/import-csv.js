const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "samadhiarana",
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
            row.BookingDate,
            row.CreatedAt
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
              CreatedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
              Number(row.ID),
              row.Name,
              row.Whatsapp || null,
              row.Phone || null,
              Number(row.BookingType || 0),
              bookingDate
                .toISOString()
                .split("T")[0],
              createdAt,
            ]
          );
        }

        console.log(
          `✅ Imported ${rows.length} bookings`
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