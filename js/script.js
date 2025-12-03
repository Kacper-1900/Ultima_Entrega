
// Load players from LocalStorage 
let players = JSON.parse(localStorage.getItem("players")) || [
  {
    name: "Cristiano Ronaldo",
    position: "Forward",
    club: "Al-Nassr",
    jersey: 7
  },
  {
    name: "Kyllian Mbappe",
    position: "Forward",
    club: "Real Madrid",
    jersey: 10
  },
  {
    name: "Federico Valverde",
    position: "Midfielder",
    club: "Real Madrid",
    jersey: 8
  }
];

// Save players to LocalStorage
function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

// Index of player being edited
let editIndex = null;

// Input validation for forms
function validatePlayersInput(form) {
  if (!form) return true;

  // Get form fields 
  const number = form["add-player-jersey-number"] || form["jersey"];
  const name = form["add-player"] || form["name"];
  const position = form["add-player-position"] || form["position"];
  const club = form["add-player-club"] || form["club"];

  // Error message fields 
  const eNumber = document.getElementById("error-number");
  const eName = document.getElementById("error-name");
  const ePosition = document.getElementById("error-position");
  const eClub = document.getElementById("error-club");

  // Reset error messages
  if (eNumber) eNumber.textContent = "";
  if (eName) eName.textContent = "";
  if (ePosition) ePosition.textContent = "";
  if (eClub) eClub.textContent = "";

  let isValid = true;

  // Number validation
  if (number && (number.value.trim() === "" || isNaN(number.value) || number.value < 1 || number.value > 99)) {
    if (eNumber) eNumber.textContent = "The number must be between 1 and 99.";
    isValid = false;
  }

  // Name validation
  if (name && (name.value.trim() === "" || name.value.length < 3)) {
    if (eName) eName.textContent = "Name must contain at least 3 characters.";
    isValid = false;
  }

  // Position validation
  if (position && (position.value.trim() === "" || position.value.length < 2)) {
    if (ePosition) ePosition.textContent = "Enter a valid position.";
    isValid = false;
  }

  // Club validation
  if (club && (club.value.trim() === "" || club.value.length < 3)) {
    if (eClub) eClub.textContent = "Club must contain at least 3 letters.";
    isValid = false;
  }

  return isValid;
}

// Attach listener to the main form
function listenToEvents() {
  let addPlayersForm = document.getElementById("add-player-form");
  if (addPlayersForm) {
    addPlayersForm.addEventListener("submit", addToPlayers);
  }
}


// create or update player

function addToPlayers(event) {
  event.preventDefault();

  if (!validatePlayersInput(event.target)) return;

  const form = event.target;

  let newPlayer = {
    name: form["add-player"]?.value || form["name"]?.value,
    position: form["add-player-position"]?.value || form["position"]?.value,
    club: form["add-player-club"]?.value || form["club"]?.value,
    jersey: form["add-player-jersey-number"]?.value || form["jersey"]?.value
  };

  // Update existing player
  if (editIndex !== null) {
    players[editIndex] = newPlayer;
    editIndex = null;
  } else {
    players.push(newPlayer);
  }

  savePlayers(); // Save to LocalStorage

  if (typeof showPlayers === "function") showPlayers();
  if (typeof showPlayersEdit === "function") showPlayersEdit();

  form.reset();
}


// Delete players
function deletePlayer(index) {
  players.splice(index, 1);
  savePlayers();

  if (typeof showPlayers === "function") showPlayers();
  if (typeof showPlayersEdit === "function") showPlayersEdit();
}



// Load player data into form for editing
function editPlayer(index) {
  let player = players[index];
  editIndex = index;

  // Compatible with both pages
  const fName = document.getElementById("add-player") || document.getElementById("name");
  const fJersey = document.getElementById("add-player-jersey-number") || document.getElementById("jersey");
  const fPosition = document.getElementById("add-player-position") || document.getElementById("position");
  const fClub = document.getElementById("add-player-club") || document.getElementById("club");

  fName.value = player.name;
  fJersey.value = player.jersey;
  fPosition.value = player.position;
  fClub.value = player.club;

  window.scrollTo({ top: 0, behavior: "smooth" });
}


// Show players 
function showPlayers() {
  let list = document.getElementById("all-players");
  if (!list) return;

  list.innerHTML = "";

  for (let i = 0; i < players.length; i++) {
    let li = document.createElement("li");

    let text = document.createTextNode(
      players[i].jersey + " - " +
      players[i].name + " - " +
      players[i].position + " - " +
      players[i].club
    );
    li.appendChild(text);

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
      editPlayer(i);
    };
    li.appendChild(editBtn);

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      deletePlayer(i);
    };
    li.appendChild(deleteBtn);

    list.appendChild(li);
  }
}


// Edit players
function showPlayersEdit() {
  let table = document.getElementById("players-table");
  if (!table) return;

  table.innerHTML = "";

  for (let i = 0; i < players.length; i++) {
    let row = document.createElement("tr");

    let colJersey = document.createElement("td");
    colJersey.textContent = players[i].jersey;
    row.appendChild(colJersey);

    let colName = document.createElement("td");
    colName.textContent = players[i].name;
    row.appendChild(colName);

    let colPos = document.createElement("td");
    colPos.textContent = players[i].position;
    row.appendChild(colPos);

    let colClub = document.createElement("td");
    colClub.textContent = players[i].club;
    row.appendChild(colClub);

    let colActions = document.createElement("td");

    let editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
      editPlayer(i);
    };
    colActions.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      deletePlayer(i);
    };
    colActions.appendChild(deleteBtn);

    row.appendChild(colActions);

    table.appendChild(row);
  }
}

// Scroll fade-in animation
document.addEventListener("scroll", () => {
  const box = document.getElementById("players-box");
  if (!box) return;

  const scrollLimit = 300;
  let opacity = Math.min(1, window.scrollY / scrollLimit);
  box.style.opacity = opacity;
}
);

/* Contact form */

function validateContactInput(form) {
  const name = form["contact-name"];
  const subject = form["contact-reason"];
  const email = form["contact-email"];
  const message = form["contact-message"];

  const eName = document.getElementById("error-contact-name");
  const eSubject = document.getElementById("error-contact-reason");
  const eEmail = document.getElementById("error-contact-email");
  const eMessage = document.getElementById("error-contact-message");

  eName.textContent = "";
  eSubject.textContent = "";
  eEmail.textContent = "";
  eMessage.textContent = "";

  let valid = true;

  if (name.value.trim().length < 3) {
    eName.textContent = "El nombre debe tener al menos 3 caracteres.";
    valid = false;
  }

  if (subject.value.trim().length < 2) {
    eSubject.textContent = "Introduce un asunto válido.";
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    eEmail.textContent = "Introduce un email válido.";
    valid = false;
  }

  if (message.value.trim().length < 5) {
    eMessage.textContent = "El mensaje debe tener al menos 5 caracteres.";
    valid = false;
  }

  return valid;
}


(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateContactInput(e.target)) return;

    const data = {
      name: document.getElementById("contact-name").value,
      email: document.getElementById("contact-email").value,
      subject: document.getElementById("contact-reason").value,
      message: document.getElementById("contact-message").value,
      createdAt: new Date().toISOString()
    };

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push(data);

    localStorage.setItem("contacts", JSON.stringify(contacts));
    localStorage.setItem("last-contact", JSON.stringify(data));

    window.location.href = "contacts.html";
  });
})();



/* Fill contacts.html */

(function loadContactsPage() {
  if (!window.location.pathname.includes("contacts.html")) return;

  const last = JSON.parse(localStorage.getItem("last-contact"));
  const all = JSON.parse(localStorage.getItem("contacts")) || [];

  if (last) {
    document.getElementById("c-name").textContent = last.name;
    document.getElementById("c-email").textContent = last.email;
    document.getElementById("c-subject").textContent = last.subject;
    document.getElementById("c-message").textContent = last.message;
    document.getElementById("c-createdAt").textContent =
      new Date(last.createdAt).toLocaleString();
  }

  const list = document.getElementById("all-contacts-list");

  if (!list) return;

  if (all.length === 0) {
    list.innerHTML = "<li>No hay contactos registrados.</li>";
  } else {
    all.slice().reverse().forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${c.name}</strong> (${c.email})<br>
        <em>${c.subject}</em><br>
        ${c.message}<br>
        <small>${new Date(c.createdAt).toLocaleString()}</small>
      `;
      list.appendChild(li);
    });
  }
})();



// Clickable club logos
const CLUB_LINKS = {
  rmd: "https://www.realmadrid.com/",
  psg: "https://en.psg.fr/",
  mutd: "https://www.manutd.com/",
  mcity: "https://www.mancity.com/",
  arsenal: "https://www.arsenal.com/",
  fcb: "https://www.fcbarcelona.com/",
  atm: "https://en.atleticodemadrid.com/",
  liverpool: "https://www.liverpoolfc.com/",
  marseille: "https://www.om.fr/en",
  lyon: "https://www.ol.fr/en"
};

for (const [id, url] of Object.entries(CLUB_LINKS)) {
  const img = document.getElementById(id);
  if (img) {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => (window.location.href = url));
  }
}

// Initialize
listenToEvents();
showPlayers();
showPlayersEdit();
