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

async function loadListings() {
  listingsContainer.innerHTML = "<p>Loading listings...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    listingsContainer.innerHTML = "";

    if (querySnapshot.empty) {
      listingsContainer.innerHTML = "<p>No listings yet.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const listing = doc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${listing.title || "Untitled"}</h3>
        <p><strong>Category:</strong> ${listing.category || "N/A"}</p>
        <p><strong>City:</strong> ${listing.city || "N/A"}</p>
        <p>${listing.description || ""}</p>
      `;

      listingsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading listings:", error);
    listingsContainer.innerHTML = "<p>Error loading listings.</p>";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const city = document.getElementById("city").value.trim();
  const category = document.getElementById("category").value;

  try {
    await addDoc(collection(db, "listings"), {
      title,
      description,
      city,
      category,
      createdAt: Date.now()
    });

    alert("Listing submitted successfully.");
    form.reset();
    await loadListings();
  } catch (error) {
    console.error("Error saving listing:", error);
    alert("Error saving listing. Check browser console.");
  }
});

loadListings();
