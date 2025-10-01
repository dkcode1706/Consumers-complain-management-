// logic for pie chart to reflect total complaints and resolved.

const circle = document.getElementById('pieI');
new Chart(circle, {
    type: 'pie',
    data: {
        labels: ['Total', 'Pending', 'Resolved'],
        datasets: [{
            data: [45, 19, 5],
            backgroundColor: ['red', 'yellow', 'green']
        }]
    },
       options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right',   // move scale to right side
                    labels: {
                        usePointStyle: true, 
                        pointStyle: 'circle'
                    }
                }
            }
        }
});