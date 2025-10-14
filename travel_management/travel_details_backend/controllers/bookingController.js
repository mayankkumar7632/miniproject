const db = require("../db");

exports.addBooking = (req, res) => {
  const { user_id, destination, travel_date, days, hotel } = req.body;
  db.query(
    "INSERT INTO bookings (user_id, destination, travel_date, days, hotel) VALUES (?, ?, ?, ?, ?)",
    [user_id, destination, travel_date, days, hotel],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Booking added successfully!");
    }
  );
};

exports.getBookingsByUser = (req, res) => {
  const { user_id } = req.params;
  db.query("SELECT * FROM bookings WHERE user_id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

exports.updateBooking = (req, res) => {
  const { id } = req.params;
  const { destination, travel_date, days, hotel } = req.body;
  db.query(
    "UPDATE bookings SET destination=?, travel_date=?, days=?, hotel=? WHERE id=?",
    [destination, travel_date, days, hotel, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Booking updated successfully!");
    }
  );
};

exports.deleteBooking = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM bookings WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Booking deleted successfully!");
  });
};
