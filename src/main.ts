const GENERAL_MEMBER = "allgemein";
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
const categories = ["Sport", "Drinnen", "Draußen", "Kreativ", "Entspannung", "Lernen", "Familie"];

// ---------- LocalStorage ----------
// Mitglieder
const loadMembers = (): string[] =>
  JSON.parse(localStorage.getItem("members") || "[]");
const saveMembers = (m: string[]) =>
  localStorage.setItem("members", JSON.stringify(m));

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
  const memberInput = document.getElementById("member-input") as HTMLInputElement;
  const addMemberBtn = document.getElementById("add-member-btn")!;
  const addEventBtn = document.getElementById("add-event-btn")!;
  const resetBtn = document.getElementById("reset-week-btn")!;
  const weekSelect = document.getElementById("week-select") as HTMLSelectElement;

  let currentWeek = parseInt(localStorage.getItem("currentWeek") || "1");
  let events: EventItem[] = loadWeekEvents(currentWeek);
  const members = loadMembers();

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
      <span class="delete-btn">×</span>
    `;

    div.querySelector(".delete-btn")!.addEventListener("click", () => {
      if (!confirm(
        `Rolle ${name} wirklich löschen?\n\nAlle Termine dieser Person in ALLEN Wochen werden entfernt.`
      )) return;

      const idx = members.indexOf(name);
      if (idx !== -1) members.splice(idx, 1);
      saveMembers(members);

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
    Allgemein
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
      block.style.background = ev.member === "allgemein" ? "#d3d3d3" : memberColors[ev.member];
      block.style.color = "#000";
      if (ev.member === "allgemein") block.classList.add("general");

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

        const timeInputs = overlay.querySelectorAll<HTMLInputElement>('input[type="time"]');
const startInput = timeInputs[0];
const endInput = timeInputs[1];

const contentInput = overlay.querySelector<HTMLTextAreaElement>("textarea")!;

        const saveBtn = overlay.querySelector(".save-btn") as HTMLButtonElement;
        const deleteBtn = overlay.querySelector(".delete-entry-btn") as HTMLButtonElement;

        const categoryInputs = overlay.querySelectorAll<HTMLInputElement>('#edit-category-container input');

        // Speichern
        saveBtn.addEventListener("click", () => {
          const startArr = startInput.value.split(":").map(Number);
          const endArr = endInput.value.split(":").map(Number);
          if (startArr.length !== 2 || endArr.length !== 2) {
  alert("Bitte Start- und Endzeit ausfüllen");
  return;
}
          const startTime = startArr[0] + startArr[1] / 60;
const endTime   = endArr[0]   + endArr[1]   / 60;

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
  addMemberBtn.addEventListener("click", () => {
    const name = memberInput.value.trim();
    if (!name || members.includes(name)) return;
    members.push(name);
    saveMembers(members);
    memberInput.value = "";
    renderMembers();
  });

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

  const members = loadMembers();
  const memberSelect = document.getElementById("member-select") as HTMLSelectElement;
  const daySelect = document.getElementById("day-select") as HTMLSelectElement;
  const startInput = document.getElementById("start-time") as HTMLInputElement;
  const endInput = document.getElementById("end-time") as HTMLInputElement;
  const contentInput = document.getElementById("event-content") as HTMLTextAreaElement;
  const saveBtn = document.querySelector(".submit-btn")!;
  const backBtn = document.getElementById("back-btn")!;

  // Dropdowns füllen
  memberSelect.innerHTML =
    `<option value="allgemein">Allgemeiner Eintrag</option>` +
    members.map(m => `<option value="${m}">${m}</option>`).join("");
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
      member: memberSelect.value,
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
