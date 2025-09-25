// Toggle logic (keeps things simple and demo-friendly)
const wrapper = document.querySelector(".auth-wrapper");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const openRegister = document.getElementById("openRegister");
const openLogin = document.getElementById("openLogin");

function showRegister() {
  wrapper.classList.add("show-register");
  loginBtn.classList.remove("active");
  registerBtn.classList.add("active");
  loginBtn.setAttribute("aria-pressed", "false");
  registerBtn.setAttribute("aria-pressed", "true");
  document.querySelector(".login").setAttribute("aria-hidden", "true");
  document.querySelector(".register").setAttribute("aria-hidden", "false");
}

function showLogin() {
  wrapper.classList.remove("show-register");
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
  loginBtn.setAttribute("aria-pressed", "true");
  registerBtn.setAttribute("aria-pressed", "false");
  document.querySelector(".login").setAttribute("aria-hidden", "false");
  document.querySelector(".register").setAttribute("aria-hidden", "true");
}

registerBtn.addEventListener("click", showRegister);
loginBtn.addEventListener("click", showLogin);
openRegister.addEventListener("click", showRegister);
openLogin.addEventListener("click", showLogin);

//document.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => e.preventDefault()));

const loginForm = document.getElementById("loginForm");

const BASE_URL = "http://127.0.0.1:5000";

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    const loginData = {
      emailId: email,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/loginStaff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      alert(`Logged In Successfully!`);
      // window.location.href = "/dashboard.html"
    } catch (error) {
      alert("Failed to login. Please try again later.");
      console.error(error);
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regemail").value.trim();
    const password = document.getElementById("regpassword").value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    const registerData = {
      emailId: email,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/registerStaff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      alert(`Registered Successfully!`);
    } catch (error) {
      alert("Failed to register. Please try again later.");
      console.error(error);
    }
  });
}
