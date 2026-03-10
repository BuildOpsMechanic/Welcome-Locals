const form = document.getElementById("locationForm");
const list = document.getElementById("locationList");

let locations = JSON.parse(localStorage.getItem("locations")) || [];

renderLocations();

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const city = document.getElementById("city").value;
    const category = document.getElementById("category").value;

    const location = {
        name,
        city,
        category
    };

    locations.push(location);

    localStorage.setItem("locations", JSON.stringify(locations));

    renderLocations();

    form.reset();
});

function renderLocations() {
    list.innerHTML = "";

    locations.forEach(function(loc) {
        const item = document.createElement("li");
        item.textContent = loc.name + " - " + loc.city + " (" + loc.category + ")";
        list.appendChild(item);
    });
}
