import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyA1IeHc3DPvApcaGBkZNUZ3MBlakoVdsvQ",
authDomain: "welcome-locals-c79e1.firebaseapp.com",
projectId: "welcome-locals-c79e1",
storageBucket: "welcome-locals-c79e1.firebasestorage.app",
messagingSenderId: "645251263574",
appId: "1:645251263574:web:1ec4212a65c5c4df785ff7",
measurementId: "G-46HDKYEB4T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("listingForm");

const listingsContainer = document.getElementById("listingsContainer");
const resultsCount = document.getElementById("resultsCount");
const loadingIndicator = document.getElementById("loadingIndicator");

const filterCity = document.getElementById("filterCity");
const filterCategory = document.getElementById("filterCategory");
const filterLanguage = document.getElementById("filterLanguage");

const searchButton = document.getElementById("searchButton");
const clearFiltersButton = document.getElementById("clearFiltersButton");

let allListings = [];

function normalize(value){
return String(value || "").trim().toLowerCase();
}

function updateResultsCount(count){
resultsCount.textContent = `${count} listing${count === 1 ? "" : "s"}`;
}

function buildLanguageDisplay(listing){
const parts = [];

if (listing.primaryLanguage) {
parts.push(`Primary: ${listing.primaryLanguage}`);
}

if (listing.secondaryLanguage) {
parts.push(`Secondary: ${listing.secondaryLanguage}`);
}

if (listing.tertiaryLanguage) {
parts.push(`Tertiary: ${listing.tertiaryLanguage}`);
}

return parts.length ? parts.join(" | ") : "N/A";
}

function renderListings(listings){
listingsContainer.innerHTML = "";

if(!listings.length){
updateResultsCount(0);
listingsContainer.innerHTML = `
<div class="empty-state">
No matching listings found.
</div>
`;
return;
}

updateResultsCount(listings.length);

listings.forEach((listing) => {
const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${listing.title || "Untitled"}</h3>
<p><strong>Category:</strong> ${listing.category || "N/A"}</p>
<p><strong>City:</strong> ${listing.city || "N/A"}</p>
<p><strong>Languages:</strong> ${buildLanguageDisplay(listing)}</p>
<p>${listing.description || ""}</p>
`;

listingsContainer.appendChild(card);
});
}

function applyFilters(){
loadingIndicator.style.display = "block";

const cityValue = normalize(filterCity.value);
const categoryValue = normalize(filterCategory.value);
const languageValue = normalize(filterLanguage.value);

const filteredListings = allListings.filter((listing) => {
const listingCity = normalize(listing.city);
const listingCategory = normalize(listing.category);

const languages = [
normalize(listing.primaryLanguage),
normalize(listing.secondaryLanguage),
normalize(listing.tertiaryLanguage),
normalize(listing.languages)
].filter(Boolean);

const matchesCity = !cityValue || listingCity.includes(cityValue);
const matchesCategory = !categoryValue || listingCategory.includes(categoryValue);
const matchesLanguage = !languageValue || languages.some(lang => lang.includes(languageValue));

return matchesCity && matchesCategory && matchesLanguage;
});

renderListings(filteredListings);
loadingIndicator.style.display = "none";
}

function clearFilters(){
filterCity.value = "";
filterCategory.value = "";
filterLanguage.value = "";
renderListings(allListings);
}

async function loadListings(){
listingsContainer.innerHTML = "Loading listings...";

try{
const querySnapshot = await getDocs(collection(db, "listings"));

allListings = [];

querySnapshot.forEach((doc) => {
allListings.push(doc.data());
});

allListings.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

renderListings(allListings);
}catch(error){
console.error(error);
listingsContainer.innerHTML = "Error loading listings";
}
}

form.addEventListener("submit", async (event) => {
event.preventDefault();

const title = document.getElementById("title").value.trim();
const description = document.getElementById("description").value.trim();
const city = document.getElementById("city").value.trim();
const category = document.getElementById("category").value;
const primaryLanguage = document.getElementById("primaryLanguage").value;
const secondaryLanguage = document.getElementById("secondaryLanguage").value;
const tertiaryLanguage = document.getElementById("tertiaryLanguage").value;

if(!title || !description || !city || !category || !primaryLanguage){
alert("Please fill out all required fields.");
return;
}

const selectedLanguages = [primaryLanguage, secondaryLanguage, tertiaryLanguage].filter(Boolean);
const uniqueLanguages = new Set(selectedLanguages);

if (selectedLanguages.length !== uniqueLanguages.size) {
alert("Please do not select the same language more than once.");
return;
}

try{
await addDoc(collection(db, "listings"), {
title,
description,
city,
category,
primaryLanguage,
secondaryLanguage,
tertiaryLanguage,
createdAt: Date.now()
});

form.reset();
await loadListings();
alert("Listing submitted successfully.");
}catch(error){
console.error(error);
alert("Error saving listing");
}
});

searchButton.addEventListener("click", applyFilters);
clearFiltersButton.addEventListener("click", clearFilters);

loadListings();
