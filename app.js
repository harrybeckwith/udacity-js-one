const arr = [];
// get form elements
const name = document.getElementById("name");
const feet = document.getElementById("feet");
const inches = document.getElementById("inches");
const weight = document.getElementById("weight");
const diet = document.getElementById("diet");
let formValid = false;
// Create Dino Constructor
const Dino = function(species, fact, height, weight, diet) {
  this.species = species;
  this.fact = fact;
  this.height = parseInt(height);
  this.weight = weight;
  this.diet = diet;
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
      d.Dinos[i].diet
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
  // validate form
  // change valid variable true/false
  if (name.value == "" || feet.value == "" || weight.value == "") {
    formValid = false;
  } else {
    formValid = true;
  }
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareHumanHeight = () => {
  const arrCopy = arr;
  // compare human height to tallest dinosaur height
  // get tallest from dino and human data
  var res = Math.max.apply(
    Math,
    arrCopy.map(function(o) {
      return o.height;
    })
  );
  // find the object that is the tallest
  var found = arrCopy.filter(obj => {
    return obj.height === res;
  });

  // get human object
  const human = arrCopy.filter(obj => {
    return obj.species === "Human";
  });

  let heightDifference;
  let compareHeightResults;
  if (found[0].height > human[0].height) {
    // make comparison between human weight and dino weight
    heightDifference = found[0].height - human[0].height;
    // create string to show results
    compareHeightResults = `<p>The tallest species the ${found[0].species} is ${heightDifference} inches taller than ${human[0].name}.</p>`;
  } else {
    // create string to show results
    compareHeightResults = `<p>invalid human height</p>`;
  }

  console.log(compareHeightResults);
  const compare = document.querySelector(".compare");
  compare.innerHTML = compareHeightResults;
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareHumanWeight = () => {
  const arrCopy = arr;
  // compare human height to tallest dinosaur height
  // get tallest from dino and human data
  var res = Math.max.apply(
    Math,
    arrCopy.map(function(o) {
      return o.weight;
    })
  );
  // find the object that is the tallest
  var found = arrCopy.filter(obj => {
    return obj.weight === res;
  });

  // get human object
  const human = arrCopy.filter(obj => {
    return obj.species === "Human";
  });

  let weightDifference;
  let compareWeightResult;
  if (found[0].weight > human[0].weight) {
    // make comparison between human weight and dino weight
    weightDifference = found[0].weight - human[0].weight;
    // create string to show results
    compareWeightResult = `<p>The heaviest species the ${found[0].species} is ${weightDifference} pounds heavier than ${human[0].name}.</p>`;
  } else {
    // create string to show results
    compareWeightResult = `<p>Invalid human weight</p>`;
  }
  // add result to DOM
  const compare = document.querySelector(".compare");
  compare.innerHTML += compareWeightResult;
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareDiet = () => {
  const arrCopy = arr;
  console.log("arrCopy", arrCopy);
  // get human object
  const human = arrCopy.filter(obj => {
    return obj.species === "Human";
  });
  console.log("arrCopy", arrCopy);
  // get human diet
  const humanDiet = human[0].diet.toLowerCase();
  // filter all dinosaurs with this diet
  const dinoDietMatch = arrCopy.filter(obj => {
    return obj.diet === humanDiet;
  });
  // create  a list of matching dinosaurs with the same diet
  let compareString = "";
  for (let i = 0; i < dinoDietMatch.length; i++) {
    compareString += dinoDietMatch[i].species + ", ";
  }
  console.log("compareString", compareString);
  console.log(dinoDietMatch);
  // add result to DOM
  const compare = document.querySelector(".compare");
  if (compareString.length > 0) {
    compare.innerHTML += `The ${compareString} all have the same diet as ${human[0].name} which is a ${humanDiet} diet.`;
  } else {
    compare.innerHTML += `No dinosaur has the ${humanDiet}.`;
  }
};

// Generate Tiles for each Dino in Array

// Add tiles to DOM
const createTiles = combinedArr => {
  // move human tile func
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  // move human tile to center tile 3*3 tiles
  combinedArr.move(8, 4);

  console.log(combinedArr);

  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  // loop through dinosaur and human data
  for (var i = 0; i < combinedArr.length; i++) {
    if (combinedArr[i].species === "Human") {
      // create html for human
      grid.innerHTML += `<div class="grid-item ${combinedArr[i].species}">
 <h3>${combinedArr[i].name}</h3>
 <img src="/images/${combinedArr[i].species}.png"/>
 </div>`;
    } else {
      // create html for dino
      grid.innerHTML += `<div class="grid-item ${combinedArr[i].species}">
 <h3>${combinedArr[i].species}</h3>
 <img src="/images/${combinedArr[i].species}.png"/>
 <p>${combinedArr[i].fact}</p>
 </div>`;
    }
  }
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
        compareHumanHeight();
        compareHumanWeight();
        compareDiet();
      });
  }
};

document.getElementById("btn").addEventListener("click", callback, false);
