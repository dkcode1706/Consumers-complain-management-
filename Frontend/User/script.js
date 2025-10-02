// Animate on scroll
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );
  elements.forEach((el) => observer.observe(el));

  // Complaint form handler
  const BASE_URL = "http://127.0.0.1:5000";
  const complaintForm = document.getElementById("complaint-form");
  const statusEl = document.getElementById("form-status");

  if (complaintForm) {
    complaintForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("customerName").value.trim();
      const email = document.getElementById("customerEmail").value.trim();
      const problemType = document.getElementById("problem").value.trim();
      const description = document.getElementById("description").value.trim();

      if (!name || !email || !problemType || !description) {
        statusEl.textContent = "⚠️ Please fill out all fields.";
        statusEl.style.color = "red";
        return;
      }

      const complaintData = {
        customerName: name,
        customerEmail: email,
        complaintDescription: description,
        priority: "Medium",
      };

      try {
        statusEl.textContent = "⏳ Submitting...";
        statusEl.style.color = "#333";

        const res = await fetch(`${BASE_URL}/api/registerComplaint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(complaintData),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Request failed");

        statusEl.textContent = `✅ Complaint registered! ID: ${data.complaintId}`;
        statusEl.style.color = "green";
        complaintForm.reset();
      } catch (err) {
        console.error(err);
        statusEl.textContent = "❌ Failed to submit complaint.";
        statusEl.style.color = "red";
      }
    });
  }

  const trackForm = document.getElementById("track-form");
  const resultBox = document.getElementById("complaint-result");

  if (trackForm) {
    trackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("complaintId").value.trim();

      if (!id) {
        alert("Please enter your complaint ID.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/getComplaint/${id}`);
        const data = await res.json();

        if (!res.ok) {
          resultBox.classList.remove("hidden", "success");
          resultBox.classList.add("error");
          resultBox.innerHTML = `<p>❌ ${data.error}</p>`;
          return;
        }

        resultBox.classList.remove("hidden", "error");
        resultBox.classList.add("success");
        resultBox.innerHTML = `
  <h3>📄 Complaint Details</h3>
  <p><strong>ID:</strong> ${id}</p>
  <p><strong>Name:</strong> ${data.customerName}</p>
  <p><strong>Email:</strong> ${data.customerEmail}</p>
  <p><strong>Description:</strong> ${data.complaintDescription}</p>
  <p><strong>Priority:</strong> ${data.priority}</p>
  <p><strong>Status:</strong> ${data.status || "Pending"}</p>
  <p><strong>Created At:</strong> ${data.createdAt || "N/A"}</p>
`;

        resultBox.innerHTML = `
        <h3>📄 Complaint Details</h3>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Description:</strong> ${data.complaintDescription}</p>
        <p><strong>Priority:</strong> ${data.priority}</p>
        <p><strong>Status:</strong> ${data.status || "Pending"}</p>
        <p><strong>Created At:</strong> ${data.createdAt || "N/A"}</p>
      `;
      } catch (error) {
        console.error(error);
        resultBox.innerHTML = `<p style="color:red;">⚠️ Failed to fetch complaint info. Try again later.</p>`;
      }
    });
  }
});
