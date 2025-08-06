/** 
 * Stores the current Chart.js instance to allow destroying and redrawing the chart.
 * @type {Chart|null}
 */
let chartInstance = null;


/**
 * Capitalizes the first letter of a given label (used for chart labels).
 * 
 * @param {string} label - The label text to capitalize.
 * @returns {string} - Capitalized label.
 */
function capitalizeLabel(label) {
    return label.charAt(0).toUpperCase() + label.slice(1);
}


/**
 * Capitalizes the first letter of a general string.
 * 
 * @param {string} text - The input text to capitalize.
 * @returns {string} - Capitalized text.
 */
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * Renders a horizontal bar chart showing the Pokémon's base stats.
 * 
 * @param {number[]} base_stat - Array of base stat values.
 * @param {string[]} name_stat - Array of stat names (e.g., "hp", "attack").
 * @param {number} id - The Pokémon ID used to target the correct canvas element.
 */
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

    // Destroy previous chart instance if it exists
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
            indexAxis: "y",
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