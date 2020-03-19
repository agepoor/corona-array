const main = document.getElementById("main");
const projectBtn = document.getElementById("project");
const addCountryBtn = document.getElementById("add-country");
const showIncBtn = document.getElementById("show-increasing");
const sortBtn = document.getElementById("sort");
const calcTotalBtn = document.getElementById("calculate-total");

let data = [];

getRandomCountry();
getRandomCountry();
getRandomCountry();

// Fetch random user and add money
async function getRandomCountry() {
  const res = await fetch("https://api.covid19api.com/summary");
  const data = await res.json();
  const country =
    data.Countries[Math.floor(Math.random() * data.Countries.length)];

  const newCountry = {
    name: `${country.Country}`,
    cases: `${country.TotalConfirmed}`,
    newcases: `${country.NewConfirmed}`,
    growthrate: Number(
      (country.TotalConfirmed + country.NewConfirmed) / country.TotalConfirmed
    )
  };

  console.log(newCountry);

  addData(newCountry);
}

// Project cases
function projectCases() {
  data = data.map(item => {
    return {
      ...item,
      cases: item.cases * item.growthrate
    };
  });

  updateDOM();
}

// Sort countries by cases
function sortByCases() {
  data.sort((a, b) => b.cases - a.cases);

  updateDOM();
}

// Show increase only
function showIncreasing() {
  data = data.filter(country => country.growthrate > 1);

  updateDOM();
}

// Calculate Total Cases
function calcTotal() {
  const totalcases = data.reduce(function(acc, country) {
    return acc + Number(country.cases);
  }, 0);

  // console.log(totalcases);
  const casesEl = document.createElement("div");
  casesEl.classList.add("total");
  casesEl.innerHTML = `<h3>Total Cases: <strong>${Math.floor(
    totalcases
  )}</strong></h3>`;
  main.appendChild(casesEl);
}

// Add new obj to data arr
function addData(obj) {
  data.push(obj);

  // Removes duplicates https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
  data = Array.from(new Set(data.map(a => a.name))).map(name => {
    return data.find(a => a.name === name);
  });

  updateDOM();
}

// update DOM
function updateDOM(providedData = data) {
  // Clear main div
  main.innerHTML = "<h2><strong>Country</strong>Cases</h2>";

  providedData.forEach(item => {
    const element = document.createElement("div");
    element.classList.add("country");
    element.innerHTML = `<strong>${item.name}</strong> ${Number(
      item.cases
    ).toFixed()}`;
    main.appendChild(element);
  });
}

// Event Listeners
addCountryBtn.addEventListener("click", getRandomCountry);
projectBtn.addEventListener("click", projectCases);
sortBtn.addEventListener("click", sortByCases);
showIncBtn.addEventListener("click", showIncreasing);
calcTotalBtn.addEventListener("click", calcTotal);
