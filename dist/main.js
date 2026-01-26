document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const membersContainer = document.getElementById("members-container");
    const addMemberBtn = document.getElementById("add-member-btn");
    const memberInput = document.getElementById("member-input");
    const days = [
        { key: "Mon", long: "Montag", short: "Mo" },
        { key: "Tue", long: "Dienstag", short: "Di" },
        { key: "Wed", long: "Mittwoch", short: "Mi" },
        { key: "Thu", long: "Donnerstag", short: "Do" },
        { key: "Fri", long: "Freitag", short: "Fr" },
        { key: "Sat", long: "Samstag", short: "Sa" },
        { key: "Sun", long: "Sonntag", short: "So" }
    ];
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);
    const headerRow = document.createElement("div");
    headerRow.className = "calendar-header";
    function renderHeader() {
        headerRow.innerHTML =
            `<div>Zeit</div>` +
                days.map(d => `<div>${window.innerWidth < 600 ? d.short : d.long}</div>`).join("");
    }
    renderHeader();
    window.addEventListener("resize", renderHeader);
    calendar.appendChild(headerRow);
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "calendar-body";
    hours.forEach(hour => {
        const timeCell = document.createElement("div");
        timeCell.className = "time";
        timeCell.textContent = `${hour}:00`;
        bodyGrid.appendChild(timeCell);
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            bodyGrid.appendChild(cell);
        }
    });
    calendar.appendChild(bodyGrid);
    let members = ["Mama", "Papa", "Kind 1"];
    function renderMembers() {
        membersContainer.innerHTML = "";
        members.forEach(name => {
            const div = document.createElement("div");
            div.className = "member";
            div.textContent = name;
            membersContainer.appendChild(div);
        });
    }
    renderMembers();
    addMemberBtn.addEventListener("click", () => {
        const name = memberInput.value.trim();
        if (!name)
            return;
        members.push(name);
        renderMembers();
        memberInput.value = "";
    });
});
