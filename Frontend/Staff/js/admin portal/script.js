// logic for nav bar hide and show.

const navClose = document.querySelector(".close")
const nav = document.querySelector(".nav")
const more = document.querySelector(".navHiddenImg")
const navHidden = document.querySelector(".hiddenNav")
const overview = document.querySelector(".overviewMainCont")   // logic for content shifting with nav enable / disable.
const pieChart = document.querySelector(".peakTrend")


console.log(nav)

navClose.addEventListener("click", () => {
    //   nav.classList.add("slide")
    nav.style.display = "none"
    navHidden.style.display = "block"
    overview.style.width = "100vw"
    overview.style.left = "0vw"
    overview.style.top = "-39vw"
    pieChart.style.left= "75vw"

})

more.addEventListener("click", () => {

    navHidden.style.display = "none"
    nav.style.display = "block"
    overview.style.width = "80vw"
    overview.style.left = "20%"
    overview.style.top = "-46vw"
    pieChart.style.left= "57vw"


})

// Active nav

const navLinks = document.querySelectorAll(".li");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});


// pie chart in overview page

const ctx = document.getElementById('myChart');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['New connection', 'Billing complaint', 'Meter Burned', 'Other'],
        datasets: [{
            data: [12, 19, 3, 5],
            backgroundColor: ['red', 'blue', 'yellow', 'green']
        }]
    },
    options: {
        responsive: false,   // disable auto resize
        maintainAspectRatio: false
    }
});
