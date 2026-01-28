const currentUser = localStorage.getItem("currentUser");

// ======== PAGE PROTECTION ========
// ======== LOGOUT ========
const headerUser = document.getElementById("header-user");

if (headerUser) {
  const user = localStorage.getItem("currentUser");
  if (user) {
    headerUser.textContent = `Hallo, ${user}!`;
  }
}

const logoutBtn = document.getElementById("logout-btn");
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser"); // Benutzer ausloggen
  window.location.href = "login.html";    // Zur Login-Seite weiterleiten
});
const isAuthPage =
  location.pathname.includes("login") ||
  location.pathname.includes("register");

if (!currentUser && !isAuthPage) {
  window.location.href = "login.html";
}
const AVATARS = Array.from({ length: 10 }, (_, i) => `avatar${i + 1}`);
let selectedAvatar = AVATARS[0];


type User = {
  name: string;
  password: string;
  avatar: string;
};

// ======== LOGIN ========
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement | null;
const isLoginPage = document.getElementById("login-btn") !== null;
const isRegisterPage = document.getElementById("register-btn") !== null;
// ======== AVATAR AUSWAHL (REGISTER) ========
if (isRegisterPage) {
  const avatarGrid = document.getElementById("register-avatar-grid");

  if (avatarGrid) {
    avatarGrid.innerHTML = "";

    AVATARS.forEach((av, index) => {
      const img = document.createElement("img");
      img.src = `avatars/${av}.png`;
      img.className = "avatar";

      if (index === 0) img.classList.add("selected");

      img.addEventListener("click", () => {
        document
          .querySelectorAll(".avatar")
          .forEach(a => a.classList.remove("selected"));

        img.classList.add("selected");
        selectedAvatar = av;
      });

      avatarGrid.appendChild(img);
    });
  }
}


if (isLoginPage && loginBtn) {
  loginBtn.addEventListener("click", () => {
    const name = (document.getElementById("login-name") as HTMLInputElement).value.trim();
    const password = (document.getElementById("login-password") as HTMLInputElement).value;

    const storedUsers: User[] =
  JSON.parse(localStorage.getItem("users") || "[]");

const user = storedUsers.find(
  u => u.name === name && u.password === password
);

    if (!user) {
      const err = document.getElementById("login-error");
      if (err) err.textContent = "Falsche Daten";
      return;
    }

    localStorage.setItem("currentUser", name);
    window.location.href = "index.html";
  });
}


// ======== REGISTER ========
const registerBtn = document.getElementById("register-btn") as HTMLButtonElement | null;

if (isRegisterPage && registerBtn) {
  registerBtn.addEventListener("click", () => {
    const name = (document.getElementById("register-name") as HTMLInputElement).value.trim();
    const pw1 = (document.getElementById("register-password") as HTMLInputElement).value;
    const pw2 = (document.getElementById("register-password-repeat") as HTMLInputElement).value;

    const error = document.getElementById("register-error");

    if (!name || !pw1 || pw1 !== pw2) {
      if (error) error.textContent = "Ungültige Eingabe";
      return;
    }

    const storedUsers: User[] =
  JSON.parse(localStorage.getItem("users") || "[]");

if (storedUsers.some(u => u.name === name)) {
  if (error) error.textContent = "Name existiert bereits";
  return;
}

storedUsers.push({
  name,
  password: pw1,
  avatar: selectedAvatar
});


localStorage.setItem("users", JSON.stringify(storedUsers));

addUserAsMember(name);


    window.location.href = "login.html";
  });
}



declare const Chart: any;

const GENERAL_MEMBER = "gemeinsame zeit";
const GENERAL_COLOR = "#bdbdbd";

const MIN_TIME = 6.5;
const MAX_TIME = 23;

const TOTAL_WEEKS = 7;

function removeMemberFromAllWeeks(memberName: string) {
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const weekEvents = loadWeekEvents(week);
    const filtered = weekEvents.filter(ev => ev.member !== memberName);
    saveWeekEvents(week, filtered);
  }
}

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type EventItem = {
  member: string;
  owner: string;
  day: Day;
  start: number;
  end: number;
  content: string; // Detailbeschreibung
  categories: string[]; // Neu: Kategorien
};

const days: { key: Day; label: string }[] = [
  { key: "Mon", label: "Mo" },
  { key: "Tue", label: "Di" },
  { key: "Wed", label: "Mi" },
  { key: "Thu", label: "Do" },
  { key: "Fri", label: "Fr" },
  { key: "Sat", label: "Sa" },
  { key: "Sun", label: "So" }
];

const legendContainer = document.getElementById("legend-container");


const colors = ["#e763cf","#85a8d5","#6bba89","#c5b27b","#a473c4"];
const memberColors: Record<string,string> = {};

// Kategorien
const categories = ["Sport", "Lernen", "Handyzeit", "Erholung", "Familie", "Projektarbeit", "Hausaufgaben", "Videospiele"];

// ---------- LocalStorage ----------
// Mitglieder
const loadMembers = (): string[] =>
  JSON.parse(localStorage.getItem("members") || "[]");
const saveMembers = (m: string[]) =>
  localStorage.setItem("members", JSON.stringify(m));

function addUserAsMember(name: string) {
  const members = loadMembers();
  if (!members.includes(name)) {
    members.push(name);
    saveMembers(members);
  }
}
// Events pro Woche
const loadWeekEvents = (week: number): EventItem[] =>
  JSON.parse(localStorage.getItem(`events_week_${week}`) || "[]");
const saveWeekEvents = (week: number, events: EventItem[]) =>
  localStorage.setItem(`events_week_${week}`, JSON.stringify(events));

// Helper
function formatTime(t: number) {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
}

// ================= INDEX.HTML =================

if (document.getElementById("calendar")) {

  const calendar = document.getElementById("calendar")!;
  const membersContainer = document.getElementById("members-container")!;
  
  const addEventBtn = document.getElementById("add-event-btn")!;
  const resetBtn = document.getElementById("reset-week-btn")!;
  const weekSelect = document.getElementById("week-select") as HTMLSelectElement;

  let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
  let events: EventItem[] = loadWeekEvents(currentWeek);
  const members = loadMembers();
const auswertungBtn = document.getElementById("go-auswertung");
const profileBtn = document.getElementById("go-profile");

auswertungBtn?.addEventListener("click", () => {
  localStorage.setItem("currentWeek", currentWeek.toString());
  window.location.href = "auswertung.html";
});

profileBtn?.addEventListener("click", () => {
  localStorage.setItem("currentWeek", currentWeek.toString());
  window.location.href = "profile.html";
});

// ---------- Gemeinsame Notizen ----------
const sharedNotes = document.getElementById("shared-notes") as HTMLTextAreaElement;

if (sharedNotes) {
  // Lade gespeicherte Notizen
  sharedNotes.value = localStorage.getItem("sharedNotes") || "";

  // Speichere Änderungen automatisch
  sharedNotes.addEventListener("input", () => {
    localStorage.setItem("sharedNotes", sharedNotes.value);
  });
}


  // ---------- Reset Woche ----------  
  resetBtn.addEventListener("click", () => {
    const ok = confirm(
      `Willst du die komplette Woche ${currentWeek} zurücksetzen?\n\n` +
      "• Alle Termine dieser Woche\n\n" +
      "Diese Aktion kann nicht rückgängig gemacht werden."
    );
    if (!ok) return;

    localStorage.removeItem(`events_week_${currentWeek}`);
    events = [];
    renderGrid();
    renderEvents();
  });

  // ---------- Render Mitglieder ----------
function renderMembers() {
  membersContainer.innerHTML = "";

  // Normale Mitglieder
  members.forEach((name, i) => {
    if (!memberColors[name]) {
      memberColors[name] = colors[i % colors.length];
    }

    const div = document.createElement("div");
    div.className = "member";
    div.innerHTML = `
      <span style="
        width:10px;
        height:10px;
        border-radius:50%;
        background:${memberColors[name]};
        display:inline-block;
      "></span>
      ${name}
  <span class="delete-btn" style="cursor:pointer; color:white;">×</span>
    `;
     div.querySelector(".delete-btn")!.addEventListener("click", () => {
  if (!confirm(
    `Rolle ${name} wirklich löschen?\n\nAlle Termine dieser Person in ALLEN Wochen werden entfernt.`
  )) return;

  // 1️⃣ Mitglied aus members entfernen
  const idx = members.indexOf(name);
  if (idx !== -1) members.splice(idx, 1);
  saveMembers(members);

  // 2️⃣ Alle Events dieser Person löschen
  removeMemberFromAllWeeks(name);

  // 3️⃣ Nutzer aus users löschen
  let storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  storedUsers = storedUsers.filter(u => u.name !== name);
  localStorage.setItem("users", JSON.stringify(storedUsers));

  // 4️⃣ Wenn aktuell eingeloggter User gelöscht wurde → Logout
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser === name) {
    localStorage.removeItem("currentUser");
    alert("Dein Konto wurde gelöscht. Du wurdest abgemeldet.");
    window.location.href = "login.html";
    return; // Stoppt weiteren Render
  }

  // 5️⃣ UI aktualisieren
  events = loadWeekEvents(currentWeek);
  renderMembers();
  renderGrid();
  renderEvents();
});

    membersContainer.appendChild(div);
  });

  // 🔒 Allgemeiner Eintrag (fix)
  const generalDiv = document.createElement("div");
  generalDiv.className = "member";
  generalDiv.style.opacity = "0.7";
  generalDiv.style.cursor = "default";
  generalDiv.innerHTML = `
    <span style="
      width:10px;
      height:10px;
      border-radius:50%;
      background:${GENERAL_COLOR};
      display:inline-block;
    "></span>
    Gemeinsame Zeit
  `;

  membersContainer.appendChild(generalDiv);
}


  // ---------- Kalender Grid ----------
  function renderGrid() {
    calendar.innerHTML = `
      <div class="calendar-header">
        <div></div>
        ${days.map(d => `<div>${d.label}</div>`).join("")}
      </div>
      <div class="calendar-body">
        ${Array.from({ length: 18 }, (_, i) => `
          <div class="time">${i + 6}:00</div>
          ${"<div class='cell'></div>".repeat(7)}
        `).join("")}
      </div>
    `;
  }

  // ---------- Events rendern ----------
  function renderEvents() {
    calendar.querySelectorAll(".event-block").forEach(e => e.remove());

    const dayWidth = (calendar.clientWidth - 80) / 7 - 4;

    events.forEach((ev, index) => {
      
      const dayIndex = days.findIndex(d => d.key === ev.day);
      if (!ev.categories) ev.categories = [];

      const block = document.createElement("div");
      block.className = "event-block";
      block.style.left = `${80 + dayIndex * ((calendar.clientWidth - 80) / 7)}px`;
      block.style.top = `${(ev.start - 6) * 50 + 38}px`;
      block.style.height = `${(ev.end - ev.start) * 50}px`;
      block.style.width = `${dayWidth}px`;
      block.style.background = ev.member === GENERAL_MEMBER ? "#d3d3d3" : memberColors[ev.member];
      block.style.color = "#000";
      if (ev.member === GENERAL_MEMBER) block.classList.add("general");


      // Kategorien als Titel
      block.innerHTML = `
        <div>${ev.categories.join(", ")}</div>
        <div class="event-time">${formatTime(ev.start)} – ${formatTime(ev.end)}</div>
      `;

      calendar.appendChild(block);
      // 🔐 Berechtigung prüfen
const loggedInUser = localStorage.getItem("currentUser") ?? "";

const canEdit =
  ev.member === GENERAL_MEMBER ||
  ev.owner === loggedInUser;

// Doppelklick → Popup zum Bearbeiten

      // Doppelklick → Popup zum Bearbeiten
if (canEdit) {
      block.addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.className = "edit-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.background = "#fff";
        overlay.style.border = "1px solid #ddd";
        overlay.style.borderRadius = "12px";
        overlay.style.padding = "12px";
        overlay.style.zIndex = "1000";
        overlay.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
        overlay.style.minWidth = "260px";

        overlay.innerHTML = `
          <label>Startzeit:</label>
          <input type="time" value="${formatTime(ev.start)}">

          <label>Endzeit:</label>
          <input type="time" value="${formatTime(ev.end)}">

          <label>Kategorien:</label>
          <div id="edit-category-container"
               style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
            ${categories.map(cat => `
              <label style="display:flex;align-items:center;gap:4px;">
                <input type="checkbox" value="${cat}"
                  ${ev.categories.includes(cat) ? "checked" : ""}>
                ${cat}
              </label>
            `).join("")}
          </div>

          <label>Inhalt:</label>
          <textarea>${ev.content}</textarea>

          <div style="display:flex;gap:6px;margin-top:6px;">
            <button class="save-btn"
              style="flex:1;background:#844aa3;color:white;">
              Speichern
            </button>
            <button class="delete-entry-btn"
              style="flex:1;background:#a40000;color:white;">
              Löschen
            </button>
          </div>
        `;

        document.body.appendChild(overlay);

        const timeInputs = overlay.querySelectorAll<HTMLInputElement>('input[type="time"]');
        const startInput = timeInputs[0];
        const endInput = timeInputs[1];
        const contentInput = overlay.querySelector<HTMLTextAreaElement>("textarea")!;
        const saveBtn = overlay.querySelector(".save-btn") as HTMLButtonElement;
        const deleteBtn = overlay.querySelector(".delete-entry-btn") as HTMLButtonElement;
        const categoryInputs =
          overlay.querySelectorAll<HTMLInputElement>('#edit-category-container input');

        saveBtn.addEventListener("click", () => {
          const startArr = startInput.value.split(":").map(Number);
          const endArr = endInput.value.split(":").map(Number);

          const startTime = startArr[0] + startArr[1] / 60;
          const endTime = endArr[0] + endArr[1] / 60;

          if (
            startTime < MIN_TIME ||
            endTime > MAX_TIME ||
            startTime >= endTime
          ) {
            alert("Zeiten müssen zwischen 06:30 und 23:00 liegen.");
            return;
          }

          ev.start = startTime;
          ev.end = endTime;
          ev.content = contentInput.value.trim();
          ev.categories =
            Array.from(categoryInputs)
              .filter(cb => cb.checked)
              .map(cb => cb.value);

          saveWeekEvents(currentWeek, events);
          overlay.remove();
          renderGrid();
          renderEvents();
        });

        deleteBtn.addEventListener("click", () => {
          events.splice(index, 1);
          saveWeekEvents(currentWeek, events);
          overlay.remove();
          renderGrid();
          renderEvents();
        });
      });
    } else {
      // 👁️ Nur ansehen
      block.style.cursor = "default";
      block.style.opacity = "0.6";
      block.title = "Nur ansehen";
    }
  });
}

  // ---------- Member hinzufügen ----------


  // ---------- + Termin ----------
  addEventBtn.addEventListener("click", () => {
    localStorage.setItem("currentWeek", currentWeek.toString());
    window.location.href = "add-event.html";
  });

  // ---------- Woche auswählen ----------
  weekSelect.value = currentWeek.toString();
  weekSelect.addEventListener("change", () => {
    currentWeek = parseInt(weekSelect.value);
    localStorage.setItem("currentWeek", currentWeek.toString());
    events = loadWeekEvents(currentWeek);
    renderGrid();
    renderEvents();
  });

  // ---------- Init ----------
  renderGrid();
  renderMembers();
  renderEvents();
  window.addEventListener("resize", renderEvents);
}

// ================= ADD-EVENT.HTML =================
if (document.getElementById("member-select")) {

  const memberSelect = document.getElementById("member-select") as HTMLSelectElement;
  const daySelect = document.getElementById("day-select") as HTMLSelectElement;
  const startInput = document.getElementById("start-time") as HTMLInputElement;
  const endInput = document.getElementById("end-time") as HTMLInputElement;
  const contentInput = document.getElementById("event-content") as HTMLTextAreaElement;
  const saveBtn = document.querySelector(".submit-btn")!;
  const backBtn = document.getElementById("back-btn")!;
const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
  memberSelect.innerHTML = `
    <option value="${GENERAL_MEMBER}">Gemeinsame Zeit</option>
    <option value="${currentUser}">Mein Eintrag (${currentUser})</option>
  `;
} else {
  alert("Nicht eingeloggt");
  window.location.href = "login.html";
}
  
  // Dropdowns füllen
   daySelect.innerHTML = days.map(d => `<option value="${d.key}">${d.label}</option>`).join("");

  // Kategorien Checkboxen hinzufügen
  const categoryContainer = document.createElement("div");
  categoryContainer.id = "category-container";
  categoryContainer.style.display = "flex";
  categoryContainer.style.flexWrap = "wrap";
  categoryContainer.style.gap = "6px";
  categoryContainer.style.marginBottom = "6px";
  categoryContainer.innerHTML = categories.map(cat => `
    <label style="display:flex;align-items:center;gap:4px;">
      <input type="checkbox" value="${cat}"> ${cat}
    </label>
  `).join("");
  contentInput.parentElement!.insertBefore(categoryContainer, contentInput);

  let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
  let events: EventItem[] = loadWeekEvents(currentWeek);

  // Speichern
  saveBtn.addEventListener("click", () => {
    const startArr = startInput.value.split(":").map(Number);
    const endArr = endInput.value.split(":").map(Number);
    if (startArr.length !== 2 || endArr.length !== 2) {
  alert("Bitte Start- und Endzeit ausfüllen");
  return;
}

    const startTime = startArr[0] + startArr[1]/60;
    const endTime = endArr[0] + endArr[1]/60;
    if (
  startTime < MIN_TIME ||
  endTime > MAX_TIME ||
  startTime >= endTime
) {
  alert("Zeiten müssen zwischen 06:30 und 23:00 liegen.");
  return;
}

    const selectedCategories = Array.from(categoryContainer.querySelectorAll<HTMLInputElement>('input:checked'))
    .map(cb => cb.value);

 events.push({
  member:
    memberSelect.value === "gemeinsame zeit"
      ? "gemeinsame zeit"
      : localStorage.getItem("currentUser")!,
  owner: localStorage.getItem("currentUser")!, // 🔑 Besitzer
  day: daySelect.value as Day,
  start: startTime,
  end: endTime,
  content: contentInput.value.trim(),
  categories: selectedCategories
});

    saveWeekEvents(currentWeek, events);
    window.location.href = "index.html";
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ================= AUSWERTUNG.HTML =================
function calculateFocusAndFreetime(events: EventItem[]) {
  let fokus = 0;
  let freizeit = 0;
  let total = 0;

  events.forEach(ev => {
    const currentUser = localStorage.getItem("currentUser");

const canEdit =
  ev.member === GENERAL_MEMBER ||
  ev.owner === currentUser;

    const duration = ev.end - ev.start;
    total += duration;

    if (ev.categories.includes("Lernen") ||
        ev.categories.includes("Projektarbeit") ||
        ev.categories.includes("Hausaufgaben")) {
      fokus += duration;
    }

    if (ev.categories.includes("Sport") ||
        ev.categories.includes("Erholung") ||
        ev.categories.includes("Familie")) {
      freizeit += duration;
    }
  });

  return {
    fokus: Math.round(fokus * 10) / 10,
    freizeitPercent: total > 0 ? Math.round((freizeit / total) * 100) : 0
  };
  
}
function renderSummaryCards(week: number) {
  const container = document.getElementById("summary-cards");
  if (!container) return;

  const events = loadWeekEvents(week);

  let gemeinsameZeit = 0;
  const aktivProTag: Record<string, number> = {};
  let fokus = 0;
  let gesamt = 0;

  events.forEach(ev => {
    const duration = ev.end - ev.start;
    gesamt += duration;

    if (ev.member === GENERAL_MEMBER) {
      gemeinsameZeit += duration;
    }

    aktivProTag[ev.day] = (aktivProTag[ev.day] || 0) + duration;

    if (
      ev.categories.includes("Lernen") ||
      ev.categories.includes("Projektarbeit") ||
      ev.categories.includes("Hausaufgaben")
    ) {
      fokus += duration;
    }
  });

  const aktivsterTag =
    Object.entries(aktivProTag).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const fokusAnteil =
    gesamt > 0 ? Math.round((fokus / gesamt) * 100) : 0;

  container.innerHTML = `
    <div class="summary-card purple">
      <div>Gemeinsame Zeit</div>
      <div class="value">${gemeinsameZeit.toFixed(1)} h</div>
    </div>

    <div class="summary-card pink">
      <div>Aktivitäten</div>
      <div class="value">${events.length}</div>
    </div>

    <div class="summary-card green">
      <div>Ø Fokus-Anteil</div>
      <div class="value">${fokusAnteil} %</div>
    </div>

    <div class="summary-card orange">
      <div>Aktivster Tag</div>
      <div class="value">${aktivsterTag}</div>
    </div>
  `;
}

function renderMemberCards(week: number) {
  const container = document.getElementById("member-cards");
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  if (!container) return;

  container.innerHTML = "";

  const members = loadMembers();
  const events = loadWeekEvents(week);

  members.forEach((member, index) => {
    const user = users.find(u => u.name === member);
const avatar = user?.avatar || "avatar1";
    const memberEvents = events.filter(e => e.member === member);
    const stats = calculateFocusAndFreetime(memberEvents);
    const color = colors[index % colors.length];

    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
      <div class="member-header">
        <img
  class="member-avatar"
  src="avatars/${avatar}.png"
  alt="${member}"
/>
        <div class="member-name">${member}</div>
      </div>

      <div class="member-metric">
        <span class="metric-label">Fokuszeit</span>
        <span class="metric-focus">${stats.fokus}h</span>
      </div>

      <div class="member-metric">
        <span class="metric-label">Freizeitanteil</span>
        <span class="metric-freetime">${stats.freizeitPercent}%</span>
      </div>
    `;

    container.appendChild(card);
  });
}


if (document.getElementById("auswertung-page")) {
  
  const indexBtn = document.getElementById("go-index");
  const auswertungBtn = document.getElementById("go-auswertung");
  const profileBtn = document.getElementById("go-profile");
  const weekSelect = document.getElementById("week-select") as HTMLSelectElement;

  indexBtn?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  auswertungBtn?.addEventListener("click", () => {
    window.location.href = "auswertung.html";
  });

  profileBtn?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
  let activityChart: any = null;
let lifeChart: any = null;

  // Chart data calculation
  function calculateChartData(week: number) {
    const events = loadWeekEvents(week);

    const categoryHours: Record<string, number> = {};
    categories.forEach(cat => categoryHours[cat] = 0);

    events.forEach(ev => {
      const duration = ev.end - ev.start;
      ev.categories.forEach(cat => {
        if (categoryHours[cat] !== undefined) {
          categoryHours[cat] += duration;
        }
      });
    });

    const freizeit =
      (categoryHours["Sport"] || 0) +
      (categoryHours["Erholung"] || 0) +
      (categoryHours["Familie"] || 0);

    const medien =
      (categoryHours["Handyzeit"] || 0) +
      (categoryHours["Videospiele"] || 0);

    const schulisch =
      (categoryHours["Lernen"] || 0) +
      (categoryHours["Projektarbeit"] || 0) +
      (categoryHours["Hausaufgaben"] || 0);

    const total = freizeit + medien + schulisch;

    return {
      activity: {
        labels: ["Sport", "Lernen", "Handyzeit", "Erholung", "Familie"],
        data: [
          categoryHours["Sport"] || 0,
          categoryHours["Lernen"] || 0,
          categoryHours["Handyzeit"] || 0,
          categoryHours["Erholung"] || 0,
          categoryHours["Familie"] || 0
        ]
      },
      life: total > 0
        ? [
            Math.round((freizeit / total) * 100),
            Math.round((medien / total) * 100),
            Math.round((schulisch / total) * 100)
          ]
        : [0, 0, 0]
    };
    
  }

  // Render charts
    function renderCharts(week: number) {
    const data = calculateChartData(week);

    // Alte Charts entfernen
    if (activityChart) activityChart.destroy();
    if (lifeChart) lifeChart.destroy();

    // 🟣 Aktivitätsdiagramm (Säulen)
    const activityCtx =
      (document.getElementById("activityChart") as HTMLCanvasElement).getContext("2d")!;

    activityChart = new Chart(activityCtx, {
      type: "bar",
      data: {
        labels: data.activity.labels,
        datasets: [{
          data: data.activity.data,
          backgroundColor: "#923fbe"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Stunden" }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    // 🟣 Lebensbereiche (Kreisdiagramm)
    const lifeCtx =
      (document.getElementById("lifeChart") as HTMLCanvasElement).getContext("2d")!;

    lifeChart = new Chart(lifeCtx, {
      type: "doughnut",
      cutout: "55%",
      data: {
        labels: ["Freizeit", "Medien", "Schulisch"],
        datasets: [{
          data: data.life,
          backgroundColor: ["#db7599", "#8bb2d7", "#f4c089"],
          borderColor: "#fff",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

  // Initialize
  let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
  weekSelect.value = currentWeek.toString();

  renderCharts(currentWeek);
renderMemberCards(currentWeek);
renderSummaryCards(currentWeek);


  weekSelect.addEventListener("change", () => {
    
    currentWeek = parseInt(weekSelect.value);
    localStorage.setItem("currentWeek", currentWeek.toString());
    renderCharts(currentWeek);
renderMemberCards(currentWeek);
renderSummaryCards(currentWeek);
  });
}

// ================= PROFILE.HTML =================
if (document.getElementById("go-index") && !document.getElementById("calendar") && !document.getElementById("auswertung-page")) {
  const indexBtn = document.getElementById("go-index");
  const auswertungBtn = document.getElementById("go-auswertung");
  const profileBtn = document.getElementById("go-profile");

  indexBtn?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  auswertungBtn?.addEventListener("click", () => {
    window.location.href = "auswertung.html";
  });

  profileBtn?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

}
if (document.getElementById("profile-page")) {
  initProfilePage();
}
function initProfilePage() {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const currentUserName = localStorage.getItem("currentUser");
  const error = document.getElementById("profile-error");

  if (!currentUserName) {
    window.location.href = "login.html";
    return;
  }

  const userIndex = users.findIndex(u => u.name === currentUserName);
  if (userIndex === -1) return;

  const user = users[userIndex];

  const nameInput = document.getElementById("profile-name") as HTMLInputElement;
  const pwInput = document.getElementById("profile-password") as HTMLInputElement;
  const pwRepeatInput = document.getElementById("profile-password-repeat") as HTMLInputElement;
  const saveBtn = document.getElementById("profile-save-btn")!;
  const cancelBtn = document.getElementById("profile-cancel-btn")!;
  const avatarGrid = document.getElementById("profile-avatar-grid")!;

  // Daten anzeigen
  nameInput.value = user.name;
  selectedAvatar = user.avatar;

  // Avatare anzeigen
  avatarGrid.innerHTML = "";
  AVATARS.forEach(av => {
    const img = document.createElement("img");
    img.src = `avatars/${av}.png`;
    img.className = "avatar";
    if (av === user.avatar) img.classList.add("selected");

    img.addEventListener("click", () => {
      document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
      img.classList.add("selected");
      selectedAvatar = av;
    });

    avatarGrid.appendChild(img);
  });

  // SPEICHERN
  saveBtn.addEventListener("click", () => {
    const newName = nameInput.value.trim();
    const pw = pwInput.value;
    const pwRepeat = pwRepeatInput.value;

    if (!newName) {
      error!.textContent = "Name darf nicht leer sein";
      return;
    }

    if (pw && pw !== pwRepeat) {
      error!.textContent = "Passwörter stimmen nicht überein";
      return;
    }

    // Name ändern
    users[userIndex].name = newName;
    users[userIndex].avatar = selectedAvatar;

    if (pw) users[userIndex].password = pw;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", newName);

    alert("Profil gespeichert");
    window.location.href = "index.html";
  });

  // ABBRECHEN
  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}



  // 👉 PRPOFIL LÖSCHEN KOMMT HIER

