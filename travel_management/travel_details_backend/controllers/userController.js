const db = require("../db");

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User registered successfully!");
    }
  );
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length > 0) res.send(result[0]);
      else res.status(401).send("Invalid credentials");
    }
  );
};

exports.getAllUsers = (req, res) => {
  db.query("SELECT id, username, email FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};
