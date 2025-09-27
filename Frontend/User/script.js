// Animate on scroll
const elements = document.querySelectorAll(".animate-on-scroll");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{ threshold:0.2 });
elements.forEach(el => observer.observe(el));

// Form handler (frontend only, placeholder)
const complaintForm = document.getElementById("complaint-form");
if(complaintForm){
  complaintForm.addEventListener("submit", e=>{
    e.preventDefault();
    alert("Complaint registered successfully! (Static demo)");
    complaintForm.reset();
  });
}
