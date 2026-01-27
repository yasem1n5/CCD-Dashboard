const currentUser = localStorage.getItem("currentUser");
// ======== PAGE PROTECTION ========
// ======== LOGOUT ========
const logoutBtn = document.getElementById("logout-btn");
logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // Benutzer ausloggen
    window.location.href = "login.html"; // Zur Login-Seite weiterleiten
});
const isAuthPage = location.pathname.includes("login") ||
    location.pathname.includes("register");
if (!currentUser && !isAuthPage) {
    window.location.href = "login.html";
}
// ======== LOGIN ========
const loginBtn = document.getElementById("login-btn");
const isLoginPage = document.getElementById("login-btn") !== null;
const isRegisterPage = document.getElementById("register-btn") !== null;
if (isLoginPage && loginBtn) {
    loginBtn.addEventListener("click", () => {
        const name = document.getElementById("login-name").value.trim();
        const password = document.getElementById("login-password").value;
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const user = storedUsers.find(u => u.name === name && u.password === password);
        if (!user) {
            const err = document.getElementById("login-error");
            if (err)
                err.textContent = "Falsche Daten";
            return;
        }
        localStorage.setItem("currentUser", name);
        window.location.href = "index.html";
    });
}
// ======== REGISTER ========
const registerBtn = document.getElementById("register-btn");
if (isRegisterPage && registerBtn) {
    registerBtn.addEventListener("click", () => {
        const name = document.getElementById("register-name").value.trim();
        const pw1 = document.getElementById("register-password").value;
        const pw2 = document.getElementById("register-password-repeat").value;
        const error = document.getElementById("register-error");
        if (!name || !pw1 || pw1 !== pw2) {
            if (error)
                error.textContent = "Ungültige Eingabe";
            return;
        }
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        if (storedUsers.some(u => u.name === name)) {
            if (error)
                error.textContent = "Name existiert bereits";
            return;
        }
        storedUsers.push({ name, password: pw1 });
        localStorage.setItem("users", JSON.stringify(storedUsers));
        addUserAsMember(name);
        window.location.href = "login.html";
    });
}
const GENERAL_MEMBER = "gemeinsame zeit";
const GENERAL_COLOR = "#bdbdbd";
const MIN_TIME = 6.5;
const MAX_TIME = 23;
const TOTAL_WEEKS = 7;
function removeMemberFromAllWeeks(memberName) {
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
        const weekEvents = loadWeekEvents(week);
        const filtered = weekEvents.filter(ev => ev.member !== memberName);
        saveWeekEvents(week, filtered);
    }
}
const days = [
    { key: "Mon", label: "Mo" },
    { key: "Tue", label: "Di" },
    { key: "Wed", label: "Mi" },
    { key: "Thu", label: "Do" },
    { key: "Fri", label: "Fr" },
    { key: "Sat", label: "Sa" },
    { key: "Sun", label: "So" }
];
const legendContainer = document.getElementById("legend-container");
const colors = ["#e763cf", "#85a8d5", "#6bba89", "#c5b27b", "#a473c4"];
const memberColors = {};
// Kategorien
const categories = ["Sport", "Lernen", "Handyzeit", "Erholung", "Familie", "Projektarbeit", "Hausaufgaben", "Videospiele"];
// ---------- LocalStorage ----------
// Mitglieder
const loadMembers = () => JSON.parse(localStorage.getItem("members") || "[]");
const saveMembers = (m) => localStorage.setItem("members", JSON.stringify(m));
function addUserAsMember(name) {
    const members = loadMembers();
    if (!members.includes(name)) {
        members.push(name);
        saveMembers(members);
    }
}
// Events pro Woche
const loadWeekEvents = (week) => JSON.parse(localStorage.getItem(`events_week_${week}`) || "[]");
const saveWeekEvents = (week, events) => localStorage.setItem(`events_week_${week}`, JSON.stringify(events));
// Helper
function formatTime(t) {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
// ================= INDEX.HTML =================
if (document.getElementById("calendar")) {
    const calendar = document.getElementById("calendar");
    const membersContainer = document.getElementById("members-container");
    const addEventBtn = document.getElementById("add-event-btn");
    const resetBtn = document.getElementById("reset-week-btn");
    const weekSelect = document.getElementById("week-select");
    let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
    let events = loadWeekEvents(currentWeek);
    const members = loadMembers();
    const auswertungBtn = document.getElementById("go-auswertung");
    const verbesserungBtn = document.getElementById("go-verbesserung");
    auswertungBtn === null || auswertungBtn === void 0 ? void 0 : auswertungBtn.addEventListener("click", () => {
        localStorage.setItem("currentWeek", currentWeek.toString());
        window.location.href = "auswertung.html";
    });
    verbesserungBtn === null || verbesserungBtn === void 0 ? void 0 : verbesserungBtn.addEventListener("click", () => {
        localStorage.setItem("currentWeek", currentWeek.toString());
        window.location.href = "verbesserung.html";
    });
    // ---------- Gemeinsame Notizen ----------
    const sharedNotes = document.getElementById("shared-notes");
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
        const ok = confirm(`Willst du die komplette Woche ${currentWeek} zurücksetzen?\n\n` +
            "• Alle Termine dieser Woche\n\n" +
            "Diese Aktion kann nicht rückgängig gemacht werden.");
        if (!ok)
            return;
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
            div.querySelector(".delete-btn").addEventListener("click", () => {
                if (!confirm(`Rolle ${name} wirklich löschen?\n\nAlle Termine dieser Person in ALLEN Wochen werden entfernt.`))
                    return;
                const idx = members.indexOf(name);
                if (idx !== -1)
                    members.splice(idx, 1);
                saveMembers(members);
                // Alle Events dieser Person löschen
                removeMemberFromAllWeeks(name);
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
            if (!ev.categories)
                ev.categories = [];
            const block = document.createElement("div");
            block.className = "event-block";
            block.style.left = `${80 + dayIndex * ((calendar.clientWidth - 80) / 7)}px`;
            block.style.top = `${(ev.start - 6) * 50 + 38}px`;
            block.style.height = `${(ev.end - ev.start) * 50}px`;
            block.style.width = `${dayWidth}px`;
            block.style.background = ev.member === GENERAL_MEMBER ? "#d3d3d3" : memberColors[ev.member];
            block.style.color = "#000";
            if (ev.member === GENERAL_MEMBER)
                block.classList.add("general");
            // Kategorien als Titel
            block.innerHTML = `
        <div>${ev.categories.join(", ")}</div>
        <div class="event-time">${formatTime(ev.start)} – ${formatTime(ev.end)}</div>
      `;
            calendar.appendChild(block);
            // Doppelklick → Popup zum Bearbeiten
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
          <div id="edit-category-container" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
            ${categories.map(cat => `
              <label style="display:flex;align-items:center;gap:4px;">
                <input type="checkbox" value="${cat}" ${ev.categories.includes(cat) ? "checked" : ""}>
                ${cat}
              </label>
            `).join("")}
          </div>
          <label>Inhalt:</label>
          <textarea>${ev.content}</textarea>
          <div style="display:flex; gap:6px; margin-top:6px;">
            <button class="save-btn" style="flex:1; background:#844aa3; color:white;">Speichern</button>
            <button class="delete-entry-btn" style="flex:1; background:#a40000; color:white;">Löschen</button>
          </div>
        `;
                document.body.appendChild(overlay);
                const timeInputs = overlay.querySelectorAll('input[type="time"]');
                const startInput = timeInputs[0];
                const endInput = timeInputs[1];
                const contentInput = overlay.querySelector("textarea");
                const saveBtn = overlay.querySelector(".save-btn");
                const deleteBtn = overlay.querySelector(".delete-entry-btn");
                const categoryInputs = overlay.querySelectorAll('#edit-category-container input');
                // Speichern
                saveBtn.addEventListener("click", () => {
                    const startArr = startInput.value.split(":").map(Number);
                    const endArr = endInput.value.split(":").map(Number);
                    if (startArr.length !== 2 || endArr.length !== 2) {
                        alert("Bitte Start- und Endzeit ausfüllen");
                        return;
                    }
                    const startTime = startArr[0] + startArr[1] / 60;
                    const endTime = endArr[0] + endArr[1] / 60;
                    if (startTime < MIN_TIME ||
                        endTime > MAX_TIME ||
                        startTime >= endTime) {
                        alert("Zeiten müssen zwischen 06:30 und 23:00 liegen.");
                        return;
                    }
                    ev.start = startTime;
                    ev.end = endTime;
                    const newContent = contentInput.value.trim();
                    if (newContent !== ev.content) {
                        ev.content = newContent;
                    }
                    ev.categories = Array.from(categoryInputs).filter(cb => cb.checked).map(cb => cb.value);
                    saveWeekEvents(currentWeek, events);
                    overlay.remove();
                    renderGrid();
                    renderEvents();
                });
                // Löschen
                deleteBtn.addEventListener("click", () => {
                    events.splice(index, 1);
                    saveWeekEvents(currentWeek, events);
                    overlay.remove();
                    renderGrid();
                    renderEvents();
                });
            });
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
    const memberSelect = document.getElementById("member-select");
    const daySelect = document.getElementById("day-select");
    const startInput = document.getElementById("start-time");
    const endInput = document.getElementById("end-time");
    const contentInput = document.getElementById("event-content");
    const saveBtn = document.querySelector(".submit-btn");
    const backBtn = document.getElementById("back-btn");
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        memberSelect.innerHTML = `
    <option value="${GENERAL_MEMBER}">Gemeinsame Zeit</option>
    <option value="${currentUser}">Mein Eintrag (${currentUser})</option>
  `;
    }
    else {
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
    contentInput.parentElement.insertBefore(categoryContainer, contentInput);
    let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
    let events = loadWeekEvents(currentWeek);
    // Speichern
    saveBtn.addEventListener("click", () => {
        const startArr = startInput.value.split(":").map(Number);
        const endArr = endInput.value.split(":").map(Number);
        if (startArr.length !== 2 || endArr.length !== 2) {
            alert("Bitte Start- und Endzeit ausfüllen");
            return;
        }
        const startTime = startArr[0] + startArr[1] / 60;
        const endTime = endArr[0] + endArr[1] / 60;
        if (startTime < MIN_TIME ||
            endTime > MAX_TIME ||
            startTime >= endTime) {
            alert("Zeiten müssen zwischen 06:30 und 23:00 liegen.");
            return;
        }
        const selectedCategories = Array.from(categoryContainer.querySelectorAll('input:checked'))
            .map(cb => cb.value);
        events.push({
            member: memberSelect.value === "gemeinsame zeit"
                ? "gemeinsame zeit"
                : localStorage.getItem("currentUser"),
            day: daySelect.value,
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
function calculateFocusAndFreetime(events) {
    let fokus = 0;
    let freizeit = 0;
    let total = 0;
    events.forEach(ev => {
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
function renderSummaryCards(week) {
    var _a;
    const container = document.getElementById("summary-cards");
    if (!container)
        return;
    const events = loadWeekEvents(week);
    let gemeinsameZeit = 0;
    const aktivProTag = {};
    let fokus = 0;
    let gesamt = 0;
    events.forEach(ev => {
        const duration = ev.end - ev.start;
        gesamt += duration;
        if (ev.member === GENERAL_MEMBER) {
            gemeinsameZeit += duration;
        }
        aktivProTag[ev.day] = (aktivProTag[ev.day] || 0) + duration;
        if (ev.categories.includes("Lernen") ||
            ev.categories.includes("Projektarbeit") ||
            ev.categories.includes("Hausaufgaben")) {
            fokus += duration;
        }
    });
    const aktivsterTag = ((_a = Object.entries(aktivProTag).sort((a, b) => b[1] - a[1])[0]) === null || _a === void 0 ? void 0 : _a[0]) || "-";
    const fokusAnteil = gesamt > 0 ? Math.round((fokus / gesamt) * 100) : 0;
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
function renderMemberCards(week) {
    const container = document.getElementById("member-cards");
    if (!container)
        return;
    container.innerHTML = "";
    const members = loadMembers();
    const events = loadWeekEvents(week);
    members.forEach((member, index) => {
        const memberEvents = events.filter(e => e.member === member);
        const stats = calculateFocusAndFreetime(memberEvents);
        const color = colors[index % colors.length];
        const card = document.createElement("div");
        card.className = "member-card";
        card.innerHTML = `
      <div class="member-header">
        <div class="member-avatar" style="background:${color}">
          ${member.charAt(0).toUpperCase()}
        </div>
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
    const verbesserungBtn = document.getElementById("go-verbesserung");
    const weekSelect = document.getElementById("week-select");
    indexBtn === null || indexBtn === void 0 ? void 0 : indexBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    auswertungBtn === null || auswertungBtn === void 0 ? void 0 : auswertungBtn.addEventListener("click", () => {
        window.location.href = "auswertung.html";
    });
    verbesserungBtn === null || verbesserungBtn === void 0 ? void 0 : verbesserungBtn.addEventListener("click", () => {
        window.location.href = "verbesserung.html";
    });
    let activityChart = null;
    let lifeChart = null;
    // Chart data calculation
    function calculateChartData(week) {
        const events = loadWeekEvents(week);
        const categoryHours = {};
        categories.forEach(cat => categoryHours[cat] = 0);
        events.forEach(ev => {
            const duration = ev.end - ev.start;
            ev.categories.forEach(cat => {
                if (categoryHours[cat] !== undefined) {
                    categoryHours[cat] += duration;
                }
            });
        });
        const freizeit = (categoryHours["Sport"] || 0) +
            (categoryHours["Erholung"] || 0) +
            (categoryHours["Familie"] || 0);
        const medien = (categoryHours["Handyzeit"] || 0) +
            (categoryHours["Videospiele"] || 0);
        const schulisch = (categoryHours["Lernen"] || 0) +
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
    function renderCharts(week) {
        const data = calculateChartData(week);
        // Alte Charts entfernen
        if (activityChart)
            activityChart.destroy();
        if (lifeChart)
            lifeChart.destroy();
        // 🟣 Aktivitätsdiagramm (Säulen)
        const activityCtx = document.getElementById("activityChart").getContext("2d");
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
        const lifeCtx = document.getElementById("lifeChart").getContext("2d");
        lifeChart = new Chart(lifeCtx, {
            type: "doughnut",
            cutout: "55%",
            data: {
                labels: ["Freizeit", "Medien", "Schulisch"],
                datasets: [{
                        data: data.life,
                        backgroundColor: ["#b57edc", "#6fa8dc", "#f6b26b"],
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
// ================= VERBESSERUNG.HTML =================
if (document.getElementById("go-index") && !document.getElementById("calendar") && !document.getElementById("auswertung-page")) {
    const indexBtn = document.getElementById("go-index");
    const auswertungBtn = document.getElementById("go-auswertung");
    const verbesserungBtn = document.getElementById("go-verbesserung");
    indexBtn === null || indexBtn === void 0 ? void 0 : indexBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    auswertungBtn === null || auswertungBtn === void 0 ? void 0 : auswertungBtn.addEventListener("click", () => {
        window.location.href = "auswertung.html";
    });
    verbesserungBtn === null || verbesserungBtn === void 0 ? void 0 : verbesserungBtn.addEventListener("click", () => {
        window.location.href = "verbesserung.html";
    });
}
