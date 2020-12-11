const arr = [];
// get form elements
const name = document.getElementById("name");
const feet = document.getElementById("feet");
const inches = document.getElementById("inches");
const weight = document.getElementById("weight");
const diet = document.getElementById("diet");
// validation check for incomplete fields
let formValid = false;
// Create Dino Constructor
/**
 * @description Creates dinosaurs
 * @constructor
 * @param {string} species - The species of the dinosaur
 * @param {string} fact - A fact about the dinosaur
 * @param {string} height - Height of the dinosaur in inches
 * @param {string} weight - weight of the dinosaur in pounds
 * @param {string} diet - diet of the dinosaur
 * @param {string} when - diet of the dinosaur
 * @param {string} where - diet of the dinosaur
 */
const Dino = function(species, fact, height, weight, diet, where, when) {
  this.species = species;
  this.fact = fact;
  this.height = parseInt(height);
  this.weight = weight;
  this.diet = diet;
  this.where = where;
  this.when = when;
};
// Create Dino Objects
const dinoData = d => {
  // loop through data
  // create a new object for each object in data
  for (let i = 0; i < d.Dinos.length; i++) {
    const dinosaur = new Dino(
      d.Dinos[i].species,
      d.Dinos[i].fact,
      d.Dinos[i].height,
      d.Dinos[i].weight,
      d.Dinos[i].diet,
      d.Dinos[i].where,
      d.Dinos[i].when
    );
    // add to global arr
    arr.push(dinosaur);
  }
  return arr;
};

// Create Human Object
// Use IIFE to get human data from form
const createHuman = (function() {
  // create a human object with value from form
  // set species to human for identifying
  // turn feet and inches into inches for dino comparison
  return function() {
    const human = {
      name: name.value,
      species: "Human",
      height: parseInt(feet.value * 12) + parseInt(inches.value),
      weight: weight.value,
      diet: diet.value
    };
    // push the human object to the global arr
    arr.push(human);
  };
})();

// validate form
const validateForm = () => {
  // change valid variable true/false if feilds are empty/filled
  if (name.value == "" || feet.value == "" || weight.value == "") {
    formValid = false;
  } else {
    formValid = true;
  }
};

// Generate Tiles for each Dino in Array
const createTiles = combinedArr => {
  // move human tile func
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  // move human tile to center tile 3*3 tiles
  combinedArr.move(8, 4);

  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  // loop through dinosaur and human data
  for (let i = 0; i < combinedArr.length; i++) {
    if (combinedArr[i].species === "Human") {
      // add html for human to DOM
      grid.innerHTML += `<div class="grid-item ${combinedArr[i].species}">
 <h3>${combinedArr[i].name}</h3>
 <img src="/images/${combinedArr[i].species}.png"/>
 </div>`;
    } else {
      // add html for dino to DOM
      grid.innerHTML += `<div class="grid-item ${combinedArr[i].species}">
 <h3>${combinedArr[i].species}</h3>
 <img src="/images/${combinedArr[i].species}.png"/>
 <p>${getRandomFact(combinedArr[i])}</p>
 </div>`;
    }
  }
};

const getHuman = () => {
  // get human obj from arr of dinos and human
  const arrCopy = arr;
  const human = arrCopy.filter(obj => {
    return obj.species === "Human";
  });
  return human[0];
};

const compareHeightOrWeight = (obj, compare) => {
  // store human and dinosaur objects
  const human = getHuman();
  const dinosaur = obj;
  // convert weight to integers
  const dinoCompare = parseInt(dinosaur[compare]);
  const humanCompare = parseInt(human[compare]);

  // check if dino height or weight is greater than human
  if (dinoCompare > humanCompare) {
    // calc  difference
    const compareDifference = parseInt(dinoCompare - humanCompare);
    if (compare === "weight") {
      return `The ${dinosaur.species} is ${compareDifference} lbs heavier than ${human.name}`;
    } else if (compare === "height") {
      return `The ${dinosaur.species} is ${compareDifference} inches taller than ${human.name}`;
    }
  } else {
    // if human is greater than dino
    // calc  difference
    const compareDifference = parseInt(humanCompare - dinoCompare);
    if (compare === "weight") {
      return `${human.name} is ${compareDifference} lbs heavier than the ${dinosaur.species}`;
    } else if (compare === "height") {
      return `${human.name} is ${compareDifference} linches taller than the ${dinosaur.species}`;
    }
  }
};

const compareDiet = obj => {
  const human = getHuman();
  const dinosaur = obj;

  // change diets to lowercase for comparison
  const humanDiet = human.diet.toLowerCase();
  const dinoDiet = dinosaur.diet.toLowerCase();
  // check if matching diet
  if (humanDiet === dinoDiet) {
    return `${human.name} has the same diet as ${dinosaur.species} which is ${humanDiet}`;
  } else {
    // check if not a match
    return `${human.name} diet is ${humanDiet} and ${dinosaur.species} diet is ${dinoDiet} `;
  }
};

const getRandomFact = dinoObj => {
  let fact = dinoObj.fact;
  // random from 6 three compare methods used
  if (dinoObj.species !== "Pigeon") {
    switch (Math.floor(Math.random() * 6)) {
      case 0:
        fact = `The ${dinoObj.species} was found in ${dinoObj.where}`;
        break;
      case 1:
        fact = `The ${dinoObj.species} was around during the ${dinoObj.when}`;
        break;
      case 2:
        fact = `${compareHeightOrWeight(dinoObj, "weight")}`;
        break;
      case 3:
        fact = `${compareHeightOrWeight(dinoObj, "height")}`;
        break;
      case 4:
        fact = `${compareDiet(dinoObj)}`;
        break;
      case 5:
        fact = `${dinoObj.fact}`;
        break;
    }
  }
  return fact;
};

// Remove form from screen
const hideForm = () => {
  const form = document.getElementById("dino-compare");
  form.style.display = "none";
};

// On button click, prepare and display infographic
function fetchJSONData() {
  // fetch json file with dino data
  return fetch("dino.json")
    .then(function(response) {
      // check for errors
      if (response.status !== 200) {
        throw new Error(
          "Looks like there was a problem. Status Code: " + response.status
        );
      }
      // return as json
      return response.json();
    })
    .catch(function(err) {
      throw new Error(err);
    });
}

const callback = () => {
  validateForm();
  if (formValid) {
    // hide form
    hideForm();
    fetchJSONData()
      .then(data => {
        // use data to create dino objects
        dinoData(data);
      })
      .then(() => {
        // use form input from user to create human object
        createHuman();
      })
      .then(() => {
        // apply the html to DOM with combined dino and human data
        createTiles(arr);
      });
  }
};

document.getElementById("btn").addEventListener("click", callback, false);
