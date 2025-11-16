//1- Link to get a random meal
//https://www.themealdb.com/api/json/v1/1/random.php

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=


const mealsElement = document.getElementById("meals")
getRandomMeal(); // Calling the function to see random meal on the page

async function getRandomMeal() 
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const randomData = await resp.json(); // Getting data from the api
    const randomMeal = randomData.meals[0]; // Extract the single meal object from the API’s meals array

    mealsElement.innerHTML = ""; // Replace the "dummy meal"
    addMeal(randomMeal); 
}

function addMeal(mealData)
{
    const meal = document.createElement("div");
    meal.classList.add("meal");

    // Create an automatical menu
    meal.innerHTML =    `<div class="meal-header">
                            <span class="random">Meal of the Day</span>
                            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        </div>
                        <div class="meal-body">
                            <h3>${mealData.strMeal}</h3>
                            <button class="fav-btn">
                            <i class="fas fa-heart"></i>
                            </button>
                        </div>`
    
    let favouriteButton = meal.querySelector(".fav-btn");
    favouriteButton.addEventListener("click", () =>{
        if(favouriteButton.classList.contains("active"))
        {
            //We need to deactivate the button (make the button back to grey)
            favouriteButton.classList.remove('active');
            removeMealFromLocalStorage(mealData.idMeal);
        }
        else
        {
            // We need to activate the button (make the color red)
            favouriteButton.classList.add('active');
            addMealToLocalStorage(mealData.idMeal);
        }
    })

    // Add the automated menu items to the div "meals"
    mealsElement.appendChild(meal);
}   

// Creating a favourites list

function addMealToLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId]));
}

function removeMealFromLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem("mealIds",JSON.stringify(
        mealIds.filter(id => id!=mealId)
    ))

}

function getMealsFromLocalStorage()
{
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null? [] : mealIds; 
}


