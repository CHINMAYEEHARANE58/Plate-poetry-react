import React, { useState, useEffect } from 'react';
import './App.css';
import mainimg from './assets/mainpage img.jpg'
import logo from './assets/logo.png'
import cross from './assets/cross.png'



function App() {
    const [data, setData] = useState({});
    const [search, setSearch] = useState('');

    // Random meal function
    async function getRandomMeal() {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
            const result = await response.json();
            setData(result.meals[0]);
        } catch (error) {
            console.error(error);
        }
    }

    // Displaying the random meal in HTML
    function displayMeal(meals) {
        setData(meals);
    }

    useEffect(() => {
        getRandomMeal();
    }, []);

    // Function searched meal
    async function getSearchedDishes() {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${search}`);
            const result = await response.json();

            if (result.meals) {
                searchedDishes(result.meals);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Function to display searched dishes
    function searchedDishes(array) {
        let searchedMeal = "";
        array.forEach((meals) => {
            searchedMeal += `<div class="dishes">
                <img class="dishImage" src=${meals.strMealThumb} alt="" />
                <h3>${meals.strMeal}</h3>
            </div>`;
        });
        document.getElementById('searchedCategory').innerHTML = searchedMeal;
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            getSearchedDishes();
        }
    };

    async function getIngredients(mealId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const detailedData = await response.json();

            displayIngredients(detailedData.meals);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to display ingredients in the modal
    function displayIngredients(meals) {
        const meal = meals[0];

        let ingredientsList = "<h6>Ingredients:</h6><ul id='list'>";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && measure) {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }

        ingredientsList += "</ul>";

        document.getElementById('modal-content').innerHTML = ingredientsList;
        document.getElementById('modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById("modal").style.display = "none";
    }

    return (
        <div>
            {/* Main page */}
            <section id="mainPage">

                {/* Description of website */}
                <h4>Welcome to Plate Poetry</h4>
                <p>
                    your recipe solution! Simplify your daily cooking routine with our curated recipes. From easy-to-follow instructions to a list of ingredients, we've got your meals covered. Say goodbye to kitchen stress and hello to delicious simplicity. Explore now! <br />
                    Made by- Chinmayee
                </p>
                <img id="mainPageImg" src={mainimg} alt="" />
                <a href="#dishes-section"><button id="exploreButton">Explore</button></a>

                {/* Search box */}
                <input 
                    type="text" 
                    id="search" 
                    placeholder="Search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                    onKeyPress={handleSearch} 
                />

                {/* Logo */}
                <img id="logo" src={logo} alt="" />
            </section>

            {/* Dishes section */}
            <section id="dishes-section">

                {/* Random Meal section */}
                <h2>Popular</h2>

                <div id="middlContent">

                    <img 
                        className="randomMeal" 
                        src={data.strMealThumb || './assets/background img.jpg'} 
                        alt={data.strMeal || 'Random Meal'}
                    />
                    <h1 id="randomHeading">
                        {data.strMeal}<br />
                        Category: {data.strCategory}<br />
                        Region: {data.strArea}
                    </h1>
                    <button id="ingredients" onClick={() => getIngredients(data.idMeal)}>Ingredients</button>

                    {/* Modal */}
                    <div id="modal">
                        <img 
                            id="closeBtn" 
                            width="40px" 
                            src={cross} 
                            onClick={closeModal} 
                            alt="Close" 
                        />

                        <div id="modal-content"></div>
                    </div>
                </div>

                {/* Searched Category section */}
                <h5>Searched Results</h5>
                <div id="searchedCategory"></div>
            </section>
        </div>
    );
}

export default App;
