let chartInstance = null;


function capitalizeLabel(label) {
    return label.charAt(0).toUpperCase() + label.slice(1);
}


function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function renderChart(base_stat, name_stat, id) {
    const canvasId = `myChart${id}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get rendering context for:', canvasId);
        return;
    }
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: name_stat.map(capitalizeLabel),
            datasets: [
                {
                    axis: "y",
                    label: "Status",
                    data: base_stat,
                    fill: false,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 205, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(201, 203, 207, 0.2)",
                    ],
                    borderColor: [
                        "rgb(255, 99, 132)",
                        "rgb(255, 159, 64)",
                        "rgb(255, 205, 86)",
                        "rgb(75, 192, 192)",
                        "rgb(54, 162, 235)",
                        "rgb(153, 102, 255)",
                        "rgb(201, 203, 207)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 10,
                            family: 'Arial',
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10,
                            family: 'Arial',
                        }
                    }
                },
            },
            indexAxis: "y",
            plugins: {
                tooltip: {
                    enabled: true,
                    bodyFont: {
                        size: 10,
                    },
                    titleFont: {
                        size: 10,
                    },
                },
                legend: {
                    display: false,
                }
            },
        },
    });
}