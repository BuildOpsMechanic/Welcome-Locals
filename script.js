const form = document.getElementById("locationForm");
const list = document.getElementById("locationList");
const searchBox = document.getElementById("searchBox");

let locations = JSON.parse(localStorage.getItem("locations")) || [];

renderLocations(locations);

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

    renderLocations(locations);
    form.reset();
});

searchBox.addEventListener("input", function() {
    const searchTerm = searchBox.value.toLowerCase();

    const filteredLocations = locations.filter(function(loc) {
        return (
            loc.name.toLowerCase().includes(searchTerm) ||
            loc.city.toLowerCase().includes(searchTerm) ||
            loc.category.toLowerCase().includes(searchTerm)
        );
    });

    renderLocations(filteredLocations);
});

function renderLocations(locationArray) {
    list.innerHTML = "";

    locationArray.forEach(function(loc) {
        const item = document.createElement("li");
        item.textContent = loc.name + " - " + loc.city + " (" + loc.category + ")";
        list.appendChild(item);
    });
}
