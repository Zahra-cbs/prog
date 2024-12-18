let ingredients = [];

    function addIngredient() {
      const ingredientInput = document.getElementById('ingredientInput');

      //tjekker om inputtet findes
      if(!ingredientInput){
        console.error("Ingredient input npt found");
        return;
      }
      const ingredient = ingredientInput.value.trim();
      if (ingredient !== '') {
        ingredients.push(ingredient);
        ingredientInput.value = '';
        displayIngredientsToLocalStorage();
      }
    }

    function displayIngredients() {
      const ingredientList = document.getElementById('ingredientList');
      ingredientList.innerHTML = '';
      ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientList.appendChild(li);
      });
    }

    function saveIngredientsToLocalStorage(){
      localStorage.setItem('ingredients',JSON.stringify(ingredients));
    }

    document.addEventListener('DOMContentLoaded', ()=>{
      const savedIngredients = JSON.parse(localStorage.getItem('ingredients'))||[];
      ingredients = savedIngredients;
      displayIngredients();
    });

    async function calculateNutrition() {
      if (ingredients.length === 0) {
        alert('Please add ingredients first.');
        return;
      }

        // Simulerer et API kald til til at få nutrition information
        const apiEndpoint = 'https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch';
        const query = ingredients.map(encodeURIComponent).join(',');
        const url = `${apiEndpoint}?ingredients=${query}`;
        
        try{
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'API-Key': '160185'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
      }catch (error){
        console.error('Error:', error);
      }

      } 
    ;

    async function searchFood() {
      const query = document.getElementById('searchInput').value.trim();
      if (!query) {
          alert("Please enter a search term.");
          return;
      }
  
      const apiEndpoint = `https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch/${encodeURIComponent(query)}`;
      try {
          const response = await fetch(apiEndpoint, {
              method: 'GET',
              headers: { 'API-Key': '160185'}
          });
  
          if (!response.ok) throw new Error("Failed to fetch food data.");
  
          const data = await response.json();
          console.log("API Details:", data);
          displayFoodResults(data);
          
        }catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching food data.");
        }
          function displayFoodResults(data){
          const foodResults = document.getElementById('foodResults');
          foodResults.innerHTML = '';

          data.forEach(food => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${food.name}</td>
                <td>${food.energy}</td>
                <td>${food.protein}</td>
            `;
            foodResults.appendChild(row);
        });
  }}

  function updateNutriReport() {
    const meals = JSON.parse(localStorage.getItem('meals')) ||[];
    const nutriTable = document.getElementById('nutritable');

    if(!nutriTable){
      console.error("Element with id 'nutritable not found.");
      return;
    }

    //ryd eksisterende rækker udover headeren
    nutriTable.innerHTML= `
    <tr>
      <th id="nutriname">Meal Name</th>
      <th id= "mealsnutri">Meals</th>
      <th id=water">Water</th>
      <th id="kcalconsumed">kcal consumed</th>
      <th id="protein">Protein</th>
      <th id="fedt">Fedt</th>
      <th id="fiber">Fiber</th>
      </tr>
      `;

      //nu tilføjer jeg måltider til tabellen
      meals.forEach(meal => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${meal.name}</td>
            <td>${meal.ingredients.length}</td>
            <td>${meal.nutrition.water || 0} ml</td>
            <td>${meal.nutrition.energy || 0} kcal</td>
            <td>${meal.nutrition.protein || 0} g</td>
            <td>${meal.nutrition.fat || 0} g</td>
            <td>${meal.nutrition.fiber || 0} g</td>
        `;
        nutriTable.appendChild(row);
      });
  }

  document.addEventListener('DOMContentLoaded', updateNutriReport);

  //mealCreator
  let meals = JSON.parse(localStorage.getItem('meals')) || [];
let ingredient = [];

async function addIngredient() {
    const ingredientInput = document.getElementById('ingredientInput');
    const ingredient = ingredientInput.value.trim();
    if (ingredient !== '') {
        ingredients.push(ingredient);
        ingredientInput.value = '';
        displayIngredients();

        const apiEndpoint = `https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch/${encodeURIComponent(ingredient)}`;
        try {
          const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {'API-Key': '160185'}
          });

          if (!response.ok) throw new Error("Failed to fetch ingredient data");

          const data = await response.json();
          console.log("Ingredient Data:", data);

        } catch(error){
          console.error("Error fetching ingredient data:", error);

        }
    }
}

function displayIngredients() {
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = '';
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientList.appendChild(li);
    });
}

function saveMeal() {
    const mealName = document.getElementById('mealNameInput').value.trim();
    if (!mealName || ingredients.length === 0) {
        alert("Please provide a meal name and ingredients.");
        return;
    }

    const meal = {
        name: mealName,
        ingredients: [...ingredients],
        nutrition: calculateTotalNutrition()
    };

    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
    alert("Meal saved successfully!");
    ingredients = [];
    displayIngredients();
}

function calculateTotalNutrition() {
    return {
        energy: ingredients.length * 50, // Eksempelberegning
        protein: ingredients.length * 10
    };
}

//mealTracker
function loadMealOptions() {
  const mealSelect = document.getElementById('mealSelect');
  meals.forEach(meal => {
      const option = document.createElement('option');
      option.value = meal.name;
      option.textContent = meal.name;
      mealSelect.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadMealOptions();
});

async function trackMeal() {
  const mealName = document.getElementById('mealSelect').value;
  if (!mealName) {
      alert("Please select a meal.");
      return;
  }

  const trackedMeals = JSON.parse(localStorage.getItem('trackedMeals')) || [];
  trackedMeals.push({ mealName, date: new Date().toISOString() });
  localStorage.setItem('trackedMeals', JSON.stringify(trackedMeals));
  displayTrackedMeals();
}

function displayTrackedMeals() {
  const trackedMeals = JSON.parse(localStorage.getItem('trackedMeals')) || [];
  const trackedMealsList = document.getElementById('trackedMeals');

  if (!trackedMealsList){
    console.error("Element with id 'trackedMeals' not found.");
    return;
  }
  trackedMealsList.innerHTML = '';

  trackedMeals.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.mealName} - ${new Date(entry.date).toLocaleString()}`;
      trackedMealsList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadMealOptions();
  displayTrackedMeals();
});


//dashboard
function updateDashboard() {
  const trackedMeals = JSON.parse(localStorage.getItem('trackedMeals')) || [];
  const today = new Date().toISOString().slice(0, 10);

  const todayMeals = trackedMeals.filter(entry => entry.date.startsWith(today));
  const mealsToday = todayMeals.length;
  const energyToday = todayMeals.reduce((sum, entry) => {
      const meal = meals.find(m => m.name === entry.mealName);
      return sum + (meal ? meal.nutrition.energy : 0);
  }, 0);
  const proteinToday = todayMeals.reduce((sum, entry) => {
      const meal = meals.find(m => m.name === entry.mealName);
      return sum + (meal ? meal.nutrition.protein : 0);
  }, 0);

  //sørger for at mine elementer findes før ejg opdaterer dem
  const mealsTodayElement =document.getElementById('mealsToday');
  const energyTodayElement = document.getElementById('energyToday');
  const proteinTodayElement = document.getElementById('proteinToday');

  if(mealsTodayElement) mealsTodayElement.textContent= mealsToday;
  if(energyTodayElement) energyTodayElement.textContent = energyToday + " kcal";
  if (proteinTodayElement) proteinTodayElement.textContent = proteinToday + " g";
}

document.addEventListener('DOMContentLoaded', updateDashboard);

    
