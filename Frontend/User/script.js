// Animate on scroll
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

const BASE_URL = "http://127.0.0.1:5000";

// Form handler (frontend only, placeholder)
const complaintForm = document.getElementById("complaint-form");
if (complaintForm) {
  complaintForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const problemType = document.getElementById("problem").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!problemType) {
      alert("Please select a problem type.");
      return;
    }
    if (!description) {
      alert("Please describe your problem.");
      return;
    }

    let priority = "Medium";

    const complaintData = {
      customerName: name,
      customerEmail: email,
      complaintDescription: description,
      priority: priority,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/registerComplaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`ERROR: ${data.error}`);
        return;
      }

      alert(
        `Complaint registered successfully. Your complaint ID is ${data.complaintId}. Please save it for tracking.`
      );
      complaintForm.reset();
    } catch (error) {
      alert("Failed to submit complaint. Please try again later.");
      console.error(error);
    }
  });
}
