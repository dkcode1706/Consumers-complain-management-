const elements = document.querySelectorAll(".animate-on-scroll");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);
elements.forEach((el) => observer.observe(el));

// Profile dropdown toggle
const profileBtn = document.getElementById("profile-btn");
const dropdown = document.getElementById("profile-dropdown");
profileBtn.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicked outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile")) {
    dropdown.style.display = "none";
  }
});

const BASE_URL = "http://127.0.0.1:5000";

const complaintForm = document.querySelector("#complaint-form");
if (complaintForm) {
  complaintForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const problemType = document.getElementById("problem").value;
    const description = document.getElementById("description").value.trim();
    let customerName = document.getElementById("customerName").value.trim();
    let customerEmail = document.getElementById("customerEmail").value.trim();

    if (!customerName) {
      alert("Please enter your name.");
      return;
    }
    if (!customerEmail) {
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
    if (problemType === "delay") priority = "High";
    else if (problemType === "other") priority = "Low";

    const complaintData = {
      customerName,
      customerEmail,
      complaintDescription: `${problemType} :: ${description}`,
      priority,
    };

    try {
      const response = await fetch(`${BASE_URL}/registerComplaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      const result = await response.json();
      alert(
        `Complaint registered successfully. Your complaint ID is ${result.complaintId}. Please save it for tracking.`
      );

      complaintForm.reset();
    } catch (error) {
      alert("Failed to submit complaint. Please try again later.");
      console.error(error);
    }
  });
}

const trackForm = document.querySelector("#track-form");
const resultContainer = document.getElementById("complaint-result");
if (trackForm) {
  trackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const complaintId = document.getElementById("complaint-id").value.trim();

    if (!complaintId) {
      alert("Please enter your complaint ID.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/getComplaint/${complaintId}`);

      if (!response.ok) {
        if (response.status === 404) {
          resultContainer.innerHTML =
            "<p style='color: #f66;'>Complaint not found. Please check your complaint ID.</p>";
        } else {
          resultContainer.innerHTML =
            "<p style='color: #f66;'>Failed to fetch complaint details.</p>";
        }
        return;
      }

      const complaint = await response.json();

      let html = `
        <table style="width: 100%; border-collapse: collapse; color: white;">
          <tr style="background: #3498db;">
            <th style="padding: 8px; border: 1px solid #2980b9;">Field</th>
            <th style="padding: 8px; border: 1px solid #2980b9;">Value</th>
          </tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Complaint ID</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.complaintId
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Name</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.customerName
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Email</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.customerEmail
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Description</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.complaintDescription
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Priority</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.priority
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Status</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.status
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Assigned To</td><td style="padding: 8px; border: 1px solid #2980b9;">${
            complaint.assignedTo || "Not assigned yet"
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #2980b9;">Last Updated</td><td style="padding: 8px; border: 1px solid #2980b9;">${new Date(
            complaint.dateUpdated
          ).toLocaleString()}</td></tr>
        </table>
      `;

      if (complaint.comments && complaint.comments.length > 0) {
        html += "<h3 style='margin-top: 20px;'>Comments:</h3><ul>";
        complaint.comments.forEach((c) => {
          html += `<li>[${new Date(c.timestamp).toLocaleString()}] ${
            c.comment
          }</li>`;
        });
        html += "</ul>";
      }

      //   alert(message);
      resultContainer.innerHTML = html;
    } catch (error) {
      alert("Error occurred while fetching complaint details.");
      console.error(error);
    }
  });
}
