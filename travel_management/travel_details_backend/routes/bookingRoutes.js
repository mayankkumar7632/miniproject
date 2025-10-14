const express = require("express");
const {
  addBooking,
  getBookingsByUser,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/add", addBooking);
router.get("/:user_id", getBookingsByUser);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
