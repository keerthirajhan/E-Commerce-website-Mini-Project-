function loginUser(event) {
  event.preventDefault(); // stop form from reloading page

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  // Example: get stored credentials from localStorage
  let storedEmail = localStorage.getItem("email");
  let storedPassword = localStorage.getItem("password");

  if (email === storedEmail && password === storedPassword) {
    alert("Login successful!");
    window.location.href = "index.html"; // Redirect after login
  } else {
    alert("Invalid email or password!");
  }
}

function registerUser() {
  let email = document.getElementById("regEmail").value;
  let password = document.getElementById("regPassword").value;

  // Save to localStorage
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  alert("Registration successful! Now login.");
  showLogin();
}

function showLogin() {
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function showRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
}
