const BASE_URL = "http://127.0.0.1:5000";
const loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const staffId = document.getElementById("staffId").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!staffId || !password) {
      statusEl.textContent = "⚠️ Please fill out all fields.";
      statusEl.style.color = "red";
      return;
    }

    const loginData = {
      staffId: staffId,
      password: password,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/loginStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("authToken", data.token);

      loginForm.reset();
    } catch (err) {
      alert("Failed to login. Please try again later.");
      console.error(err);
    }
  });
}
