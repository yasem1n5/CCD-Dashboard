"use strict";
const days = [
    { key: "Mon", label: "Montag" },
    { key: "Tue", label: "Dienstag" },
    { key: "Wed", label: "Mittwoch" },
    { key: "Thu", label: "Donnerstag" },
    { key: "Fri", label: "Freitag" },
    { key: "Sat", label: "Samstag" },
    { key: "Sun", label: "Sonntag" }
];
const hours = Array.from({ length: 24 }, (_, i) => i); // 0..23
const calendar = document.getElementById("calendar");
/* Header */
calendar.appendChild(document.createElement("div"));
days.forEach(d => {
    const h = document.createElement("div");
    h.className = "header";
    h.textContent = d.label;
    calendar.appendChild(h);
});
