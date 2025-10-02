// Pie Chart
const ctx = document.getElementById("pieChart").getContext("2d");
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Resolved", "Pending", "Overdue", "In Progress"],
    datasets: [
      {
        data: [33, 12, 30, 10],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#667eea"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
    },
    cutout: "65%",
  },
});
