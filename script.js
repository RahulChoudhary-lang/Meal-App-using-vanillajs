const form = document.querySelector(".flex");
const search = document.querySelector(".flex input[type = 'text']");
const item = document.querySelector(".item");
const result = document.querySelector(".result");
const list = document.querySelector(".list");
const favBtn = document.querySelector(".fav-btn");
const add = document.querySelector(".add");
const mealDeatils = document.querySelector(".mealDetails");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("form");
    const val = search.value;
    const id = 0;
    if (val) {
        // console.log("form")
        await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`)
            .then((response) =>
                // console.log(response)
                response.json()
            )
            .then((data) => {
                // console.log(data);

                result.innerHTML = `<p class="heading">Results for ${val}</p>`;

                if (data.meals !== null) {
                    list.innerHTML = data.meals.map(
                        (meal) =>
                            `<div class="meal">
                    <img src="${meal.strMealThumb}">   
                    <div>
                    <h6>${meal.strMeal}</h6>
                    <h6>${meal.strCategory}</h6>
                    </div>
                    <div class="btn">
                    <button class="more" mealId = "${meal.idMeal}">More Details</button>
                    <button class="fav" itemName ="${meal.strMeal}">Add Favourite</button>
                    </div>
                </div>`
                    );
                } else {
                    list.innerHTML = `<h5>Not available</h5>`
                }
            });

    }

    search.value = "";
})

const arr = [];
let a = 0;

list.addEventListener("click", async (e) => {
    const path = e.path;
    const info = path.find((item) => {
        if (item.classList) {
            return item.classList.contains('more');
        }
    });

    const fav = path.find((item) => {
        if (item.classList) {
            return item.classList.contains('fav');
        }
    });

    if (info) {
        const mealId = info.getAttribute("mealId");
        // console.log(mealId)

        await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then((response) =>
                response.json()
            )
            .then((data) => {
                const meal = data.meals[0];

                Details(meal);
            });
    }

    if (fav) {
        const itemName = fav.getAttribute("itemName");
        // console.log(itemName)

        const newLi = document.createElement("li");
        const newLiInnerHtml = `${itemName}`;

        // newLi.innerHTML = newLiInnerHtml;
        // add.append(newLi);

        for (let i = 0; i < 1; i++) {
            arr.push(`${itemName}`)
        }

        console.log(arr.length);

        arr.map((item) => console.log(item))
        let s = 0;
        if (a > 0) {
            arr.map((item) => {
                console.log("map");
                if (item !== newLiInnerHtml) {
                    s++;
                    console.log(s);

                    newLi.innerHTML = newLiInnerHtml;
                    if (s === arr.length - 1) {
                        add.append(newLi);
                    }
                } else {
                    console.log("already added");
                    return;
                }
            })
        } else {
            newLi.innerHTML = newLiInnerHtml;
            add.append(newLi);
        }
        a++;
    }
})


const Details = (meal) => {
    const ingredients = [];

    // Max of 20 ingredients
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    mealDeatils.innerHTML = `
      <div class="meal-Details">
        <h1>${meal.strMeal}</h1>
        <div class="type">
          <p>Category: ${meal.strCategory}</p>
          <p>Region: ${meal.strArea}</p>
        </div>
        <img src="${meal.strMealThumb}">
        <div>
        <h2>Ingredients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`)}
          </ul>
          <p>${meal.strInstructions}</p>
        </div>
      </div>
    `;
}

