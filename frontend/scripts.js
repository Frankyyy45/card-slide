
const API_URL = "https://randomuser.me/api/?results=3";
const container = document.querySelector("#cardsContainer");

let users = [];

let openCardIndex = null;



// Fetch users from API (returns array or null)
async function fetchUsers() {
  try {
    const response = await fetch(API_URL);

    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }

    const data = await response.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("Unexpected API response format");
    }

    return data.results;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return null;
  }
}

// Render fallback cards if fetch fails
function renderFallbackCards() {
  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const card = document.createElement("div");
    card.className = "card fallback";
    card.innerHTML = `
      <div class="card__header">
        <img class="avatar" src="assets/fallback.jpg" alt="Fallback bild">
        <h2 class="name">Kunde inte ladda användare</h2>
      </div>
      <p class="muted">Kontrollera nätverk eller försök igen senare.</p>
    `;
    container.appendChild(card);
  }
}

// Render user cards
function renderUserCards(users) {
  container.innerHTML = "";

  users.forEach((user, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const fullName = `${user.name.first} ${user.name.last}`;

    card.innerHTML = `
      <div class="card__header">
        <img class="avatar" src="${user.picture.large}" alt="Profilbild">
        <h2 class="name">${fullName}</h2>
        <button class="toggle-btn" type="button">Visa mer</button>
      </div>

      <div class="extra-info">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefon:</strong> ${user.phone}</p>
        <p><strong>Plats:</strong> ${user.location.city}, ${user.location.country}</p>
      </div>
    `;

    const visaMerBtn = card.querySelector(".toggle-btn")

    visaMerBtn.addEventListener('click', ()  => {

        if (openCardIndex !== null && openCardIndex !== index ) {
            const openCard = container.children[openCardIndex];
            openCard.classList.remove('expanded');
        }

        const isOpen = card.classList.contains('expanded');

        if (isOpen) {
            card.classList.remove('expanded');
            openCardIndex = null;
        } else {
            card.classList.add('expanded');
            openCardIndex = index;
        }

    })

    container.appendChild(card);
  });
}

// Load users and render
async function loadUsers() {
  const result = await fetchUsers();

  if (!result) {
    renderFallbackCards();
    return;
  }

  users = result;
  console.log("Users array:", users);

  renderUserCards(users);
}

loadUsers();
