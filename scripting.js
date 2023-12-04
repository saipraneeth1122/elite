const apiKey = "hRu1iDxZ8UiHwKYZi2jotjKL0a17Aidynftkr6Ad";
let nutrientChart; // Declare a global variable to store the chart instance

function searchNutrients() {
    const foodInput = document.getElementById('foodInput').value.trim();

    if (foodInput === '') {
        alert('Please enter a food item.');
        return;
    }

    fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodInput}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const firstResult = data.foods[0];
            if (firstResult) {
                displayNutrients(firstResult);
                displayNutrientChart(firstResult);
            } else {
                document.getElementById('nutrientResult').innerHTML = 'Nutrient information not found.';
                clearNutrientChart();
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayNutrients(food) {
    const nutrientResult = document.getElementById('nutrientResult');
    nutrientResult.innerHTML = `
        <h2>${food.description}</h2>
        <p>Protein: ${getNutrientValue(food, 'Protein')} g</p>
        <p>Carbohydrates: ${getNutrientValue(food, 'Carbohydrate, by difference')} g</p>
        <p>Fat: ${getNutrientValue(food, 'Total lipid (fat)')} g</p>
        <p>Calories: ${getNutrientValue(food, 'Energy')} kcal</p>
        <p>Vitamins: ${getNutrientValue(food, 'Vitamins')} mg</p>
        <p>Minerals: ${getNutrientValue(food, 'Minerals')} mg</p>
        <p>Essential Amino Acids: ${getNutrientValue(food, 'Essential Amino Acids')} g</p>
        <p>Essential Fatty Acids: ${getNutrientValue(food, 'Essential Fatty Acids')} g</p>
    `;
}

function getNutrientValue(food, nutrientName) {
    const nutrient = food.foodNutrients.find(nutrient => nutrient.nutrientName === nutrientName);
    return nutrient ? nutrient.value : 'Not available';
}

function displayNutrientChart(food) {
    // Destroy the existing chart if it exists
    if (nutrientChart) {
        nutrientChart.destroy();
    }

    const nutrients = [
        'Protein',
        'Carbohydrate, by difference',
        'Total lipid (fat)',
        'Energy',
        'Vitamins',
        'Minerals',
        'Essential Amino Acids',
        'Essential Fatty Acids'
    ];

    const nutrientValues = nutrients.map(nutrient => getNutrientValue(food, nutrient));

    const ctx = document.getElementById('nutrientChart').getContext('2d');
    nutrientChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nutrients,
            datasets: [{
                label: 'Nutrient Values',
                data: nutrientValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(210, 105, 30, 0.5)',
                    'rgba(0, 128, 0, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(210, 105, 30, 1)',
                    'rgba(0, 128, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function clearNutrientChart() {
    // Clear the canvas manually if needed
    const ctx = document.getElementById('nutrientChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
