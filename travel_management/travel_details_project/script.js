const API_URL = "http://localhost:5000/api";

// ======== Registration =========
document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    if (res.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    } else {
      const error = await res.text();
      alert("Error: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error!");
  }
});

// ======== Login =========
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const user = await res.json();
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      const error = await res.text();
      alert("Login failed: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error!");
  }
});

// ======== Dashboard Logic =========
const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedUser && document.getElementById("welcomeUser")) {
  document.getElementById("welcomeUser").innerHTML = `<h3>Hello, ${loggedUser.username}!</h3>`;
}

// ======== Add Booking =========
document.getElementById("bookingForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();
  const destination = document.getElementById("destination").value;
  const travelDate = document.getElementById("travelDate").value;
  const days = document.getElementById("days").value;
  const hotel = document.getElementById("hotel").value;

  try {
    const res = await fetch(`${API_URL}/bookings/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: loggedUser.id,
        destination,
        travel_date: travelDate,
        days,
        hotel
      })
    });
    if (res.ok) {
      alert("Booking added successfully!");
      document.getElementById("bookingForm").reset();
    } else {
      const error = await res.text();
      alert("Error: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error!");
  }
});

// Redirect to bookings page
document.getElementById("viewBookingsBtn")?.addEventListener("click", function() {
  window.location.href = "bookings.html";
});

// ======== Bookings Page Logic =========
if (window.location.pathname.endsWith("bookings.html")) displayBookings();

async function displayBookings() {
  const bookingList = document.getElementById("bookingList");
  try {
    const res = await fetch(`${API_URL}/bookings/${loggedUser.id}`);
    const bookings = await res.json();

    bookingList.innerHTML = bookings.length ? "" : "<p>No bookings yet!</p>";

    bookings.forEach(b => {
      bookingList.innerHTML += `
        <div class="booking-item" data-id="${b.id}">
          <p><b>Destination:</b> ${b.destination}</p>
          <p><b>Date:</b> ${b.travel_date}</p>
          <p><b>Days:</b> ${b.days}</p>
          <p><b>Hotel:</b> ${b.hotel}</p>
          <button onclick="editBooking(${b.id})">Edit</button>
          <button onclick="deleteBooking(${b.id})">Delete</button>
        </div>`;
    });
  } catch (err) {
    console.error(err);
    alert("Unable to fetch bookings!");
  }
}


// ======== Delete Booking =========
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;
  try {
    const res = await fetch(`${API_URL}/bookings/${id}`, { method: "DELETE" });
    if (res.ok) displayBookings();
    else alert("Failed to delete booking!");
  } catch (err) {
    console.error(err);
    alert("Server error!");
  }
}

// ======== Back to Dashboard =========
function goBack() {
  window.location.href = "dashboard.html";
}

// ======== Show all registered users (optional) =========
async function showAllUsers() {
  try {
    const res = await fetch(`${API_URL}/users/all`);
    const users = await res.json();
    console.log(users);
    alert(JSON.stringify(users, null, 2)); // Display in alert
  } catch (err) {
    console.error(err);
    alert("Unable to fetch users!");
  }
}
function enableEdit(button) {
  const row = button.closest("tr");
  const id = row.dataset.id;

  // Get current values
  const dest = row.querySelector(".dest").innerText;
  const date = row.querySelector(".date").innerText;
  const days = row.querySelector(".days").innerText;
  const hotel = row.querySelector(".hotel").innerText;

  // Replace text with input fields
  row.querySelector(".dest").innerHTML = `<input type="text" value="${dest}" />`;
  row.querySelector(".date").innerHTML = `<input type="date" value="${date}" />`;
  row.querySelector(".days").innerHTML = `<input type="number" value="${days}" />`;
  row.querySelector(".hotel").innerHTML = `<input type="text" value="${hotel}" />`;

  // Change buttons
  button.textContent = "Save";
  button.classList.add("save-btn");
  button.onclick = async function() {
    const newDest = row.querySelector(".dest input").value;
    const newDate = row.querySelector(".date input").value;
    const newDays = row.querySelector(".days input").value;
    const newHotel = row.querySelector(".hotel input").value;

    if(!newDest || !newDate || !newDays || !newHotel) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: newDest,
          travel_date: newDate,
          days: newDays,
          hotel: newHotel
        })
      });
      if(res.ok) {
        displayBookings(); // Refresh table
      } else {
        alert("Failed to update booking.");
      }
    } catch(err) {
      console.error(err);
      alert("Server error!");
    }
  };
}
async function displayBookings() {
  const bookingList = document.getElementById("bookingList");
  bookingList.innerHTML = "Loading...";
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${loggedUser.id}`);
    const bookings = await res.json();

    if(bookings.length === 0) {
      bookingList.innerHTML = "<p>No bookings yet!</p>";
      return;
    }

    let table = `<table>
                   <tr>
                     <th>ID</th>
                     <th>Destination</th>
                     <th>Date</th>
                     <th>Days</th>
                     <th>Hotel</th>
                     <th>Actions</th>
                   </tr>`;
    bookings.forEach(b => {
      table += `<tr data-id="${b.id}">
                  <td>${b.id}</td>
                  <td class="dest">${b.destination}</td>
                  <td class="date">${b.travel_date}</td>
                  <td class="days">${b.days}</td>
                  <td class="hotel">${b.hotel}</td>
                  <td>
                    <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
                    <button class="delete-btn" onclick="deleteBooking(${b.id})">Delete</button>
                  </td>
                </tr>`;
    });
    table += "</table>";
    bookingList.innerHTML = table;

  } catch(err) {
    console.error(err);
    bookingList.innerHTML = "<p>Error fetching bookings.</p>";
  }
}

//
row.querySelector(".actions").innerHTML = `
  <button class="save-btn">Save</button>
  <button class="cancel-btn">Cancel</button>
`;

row.querySelector(".save-btn").onclick = async function() { /* save logic */ }
row.querySelector(".cancel-btn").onclick = function() { /* cancel logic */ }
