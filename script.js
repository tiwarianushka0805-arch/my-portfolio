console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");
const projectSearch = document.getElementById("projectSearch");
const projectCards = document.querySelectorAll(".projects li");
const noProjectsFound = document.getElementById("noProjectsFound");

function filterProjects() {
    const query = projectSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(function (card) {
        const name = (card.getAttribute("data-name") || "").toLowerCase();
        const tech = (card.getAttribute("data-tech") || "").toLowerCase();
        const matches = name.includes(query) || tech.includes(query);

        if (matches) {
            card.classList.remove("project-hidden");
            visibleCount += 1;
        } else {
            card.classList.add("project-hidden");
        }
    });

    noProjectsFound.hidden = visibleCount !== 0;
}

if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
}

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Switch to Light Mode";
    } else {
        themeButton.textContent = "Switch to Dark Mode";
    }

});
const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");
weatherButton.addEventListener("click", getWeather);
async function getWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = "Please enter a city.";
        return;
    }

    weatherResult.textContent = "Loading weather...";

    const apiKey = "2ea535f7e57c825cd5db090bb1cd8ea6";

    const url =
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        weatherResult.innerHTML = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Condition: ${data.weather[0].description}</p>
        `;

    } catch (error) {

        weatherResult.textContent =
            "Unable to fetch weather. Please try again.";

        console.error(error);
    }
}