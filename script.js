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

const filterCity = document.getElementById("filterCity");
const filterCategory = document.getElementById("filterCategory");
const filterLanguage = document.getElementById("filterLanguage");
const searchButton = document.getElementById("searchButton");
const clearFiltersButton = document.getElementById("clearFiltersButton");

let allListings = [];

function updateResultsCount(count) {
  resultsCount.textContent = `${count} listing${count === 1 ? "" : "s"}`;
}

function renderListings(listings) {
  listingsContainer.innerHTML = "";

  if (!listings.length) {
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
      <p><strong>Language:</strong> ${listing.languages || "N/A"}</p>
      <p>${listing.description || ""}</p>
    `;

    listingsContainer.appendChild(card);
  });
}

function applyFilters() {
  const cityValue = filterCity.value.trim().toLowerCase();
  const categoryValue = filterCategory.value.trim().toLowerCase();
  const languageValue = filterLanguage.value.trim().toLowerCase();

  const filteredListings = allListings.filter((listing) => {
    const listingCity = (listing.city || "").toLowerCase();
    const listingCategory = (listing.category || "").toLowerCase();
    const listingLanguage = (listing.languages || "").toLowerCase();

    const matchesCity = !cityValue || listingCity.includes(cityValue);
    const matchesCategory = !categoryValue || listingCategory === categoryValue;
    const matchesLanguage = !languageValue || listingLanguage === languageValue;

    return matchesCity && matchesCategory && matchesLanguage;
  });

  renderListings(filteredListings);
}

function clearFilters() {
  filterCity.value = "";
  filterCategory.value = "";
  filterLanguage.value = "";
  renderListings(allListings);
}

async function loadListings() {
  listingsContainer.innerHTML = `
    <div class="empty-state">
      Loading listings...
    </div>
  `;

  try {
    const querySnapshot = await getDocs(collection(db, "listings"));

    allListings = [];

    querySnapshot.forEach((doc) => {
      allListings.push(doc.data());
    });

    allListings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    renderListings(allListings);
  } catch (error) {
    console.error("Error loading listings:", error);
    listingsContainer.innerHTML = `
      <div class="empty-state">
        Error loading listings.
      </div>
    `;
    updateResultsCount(0);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const city = document.getElementById("city").value.trim();
  const category = document.getElementById("category").value;
  const languages = document.getElementById("languages").value;

  if (!title || !description || !city || !category || !languages) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "listings"), {
      title,
      description,
      city,
      category,
      languages,
      createdAt: Date.now()
    });

    form.reset();
    await loadListings();
    alert("Listing submitted successfully.");
  } catch (error) {
    console.error("Error saving listing:", error);
    alert("Error saving listing.");
  }
});

searchButton.addEventListener("click", applyFilters);
clearFiltersButton.addEventListener("click", clearFilters);

loadListings();
