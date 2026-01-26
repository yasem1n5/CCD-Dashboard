const days = [
    { key: "Mon", label: "Mo" },
    { key: "Tue", label: "Di" },
    { key: "Wed", label: "Mi" },
    { key: "Thu", label: "Do" },
    { key: "Fri", label: "Fr" },
    { key: "Sat", label: "Sa" },
    { key: "Sun", label: "So" }
];
const colors = ["#e763cf", "#85a8d5", "#6bba89", "#c5b27b", "#a473c4"];
const memberColors = {};
// ---------- LocalStorage: Mitglieder ----------
const loadMembers = () => JSON.parse(localStorage.getItem("members") || "[]");
const saveMembers = (m) => localStorage.setItem("members", JSON.stringify(m));
// ---------- LocalStorage: Events pro Woche ----------
const loadWeekEvents = (week) => JSON.parse(localStorage.getItem(`events_week_${week}`) || "[]");
const saveWeekEvents = (week, events) => localStorage.setItem(`events_week_${week}`, JSON.stringify(events));
// ---------- Helper ----------
function formatTime(t) {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
// ================= INDEX.HTML =================
if (document.getElementById("calendar")) {
    const calendar = document.getElementById("calendar");
    const membersContainer = document.getElementById("members-container");
    const memberInput = document.getElementById("member-input");
    const addMemberBtn = document.getElementById("add-member-btn");
    const addEventBtn = document.getElementById("add-event-btn");
    const resetBtn = document.getElementById("reset-week-btn");
    const weekSelect = document.getElementById("week-select");
    // Aktuelle Woche aus LocalStorage oder Standard 1
    let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
    weekSelect.value = currentWeek.toString();
    let events = loadWeekEvents(currentWeek);
    const members = loadMembers();
    // ---------- Reset Woche ----------
    resetBtn.addEventListener("click", () => {
        const ok = confirm("Willst du die komplette Woche zurücksetzen?\n\n" +
            "• Alle Termine\n" +
            "• Alle Familienmitglieder\n\n" +
            "Diese Aktion kann nicht rückgängig gemacht werden.");
        if (!ok)
            return;
        localStorage.removeItem("members");
        for (let w = 1; w <= 7; w++)
            localStorage.removeItem(`events_week_${w}`);
        Object.keys(memberColors).forEach(k => delete memberColors[k]);
        location.reload();
    });
    // ---------- Render Mitglieder ----------
    function renderMembers() {
        membersContainer.innerHTML = "";
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
      `;
            membersContainer.appendChild(div);
        });
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
        events.forEach(ev => {
            const dayIndex = days.findIndex(d => d.key === ev.day);
            if (dayIndex === -1)
                return;
            const block = document.createElement("div");
            block.className = "event-block";
            block.style.left = `${80 + dayIndex * ((calendar.clientWidth - 80) / 7)}px`;
            block.style.top = `${(ev.start - 6) * 50 + 38}px`;
            block.style.height = `${(ev.end - ev.start) * 50}px`;
            block.style.width = `${dayWidth}px`;
            block.style.background =
                ev.member === "allgemein" ? "#d3d3d3" : memberColors[ev.member];
            block.style.color = "#000"; // alle Texte schwarz
            if (ev.member === "allgemein") {
                block.classList.add("general");
            }
            block.innerHTML = `
        <div>${ev.content}</div>
        <div class="event-time">${formatTime(ev.start)} – ${formatTime(ev.end)}</div>
      `;
            calendar.appendChild(block);
        });
    }
    // ---------- Member hinzufügen ----------
    addMemberBtn.addEventListener("click", () => {
        const name = memberInput.value.trim();
        if (!name || members.includes(name))
            return;
        members.push(name);
        saveMembers(members);
        memberInput.value = "";
        renderMembers();
    });
    // ---------- + Termin ----------
    addEventBtn.addEventListener("click", () => {
        // Aktuelle Woche speichern
        localStorage.setItem("currentWeek", currentWeek.toString());
        window.location.href = "add-event.html";
    });
    // ---------- Woche auswählen ----------
    weekSelect.addEventListener("change", () => {
        currentWeek = parseInt(weekSelect.value);
        localStorage.setItem("currentWeek", currentWeek.toString()); // speichern
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
    const members = loadMembers();
    const memberSelect = document.getElementById("member-select");
    const daySelect = document.getElementById("day-select");
    const startInput = document.getElementById("start-time");
    const endInput = document.getElementById("end-time");
    const contentInput = document.getElementById("event-content");
    const saveBtn = document.querySelector(".submit-btn");
    const backBtn = document.getElementById("back-btn");
    // Dropdowns füllen
    memberSelect.innerHTML =
        `<option value="allgemein">Allgemeiner Eintrag</option>` +
            members.map(m => `<option value="${m}">${m}</option>`).join("");
    daySelect.innerHTML =
        days.map(d => `<option value="${d.key}">${d.label}</option>`).join("");
    // Aktuelle Woche aus LocalStorage
    let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
    let events = loadWeekEvents(currentWeek);
    // Speichern
    saveBtn.addEventListener("click", () => {
        const start = startInput.value.split(":").map(Number);
        const end = endInput.value.split(":").map(Number);
        if (!contentInput.value || start.length !== 2 || end.length !== 2) {
            alert("Bitte alles ausfüllen");
            return;
        }
        const startTime = start[0] + start[1] / 60;
        const endTime = end[0] + end[1] / 60;
        if (startTime >= endTime) {
            alert("Startzeit muss vor Endzeit liegen");
            return;
        }
        events.push({
            member: memberSelect.value,
            day: daySelect.value,
            start: startTime,
            end: endTime,
            content: contentInput.value.trim()
        });
        saveWeekEvents(currentWeek, events);
        window.location.href = "index.html";
    });
    backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
