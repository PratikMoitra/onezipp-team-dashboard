"use strict";
const $ = (sel) => document.querySelector(sel + " .body");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cls = (s) => "s-" + String(s).split(" ")[0];
function table(head, rows) {
  return "<table><thead><tr>" + head.map((h) => `<th>${esc(h)}</th>`).join("") + "</tr></thead><tbody>" +
    rows.map((r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>").join("") + "</tbody></table>";
}
fetch("data.json", {cache: "no-store", credentials: "same-origin"}).then((r) => r.json()).then((d) => {
  document.getElementById("generated").textContent = d.generated;
  const statuses = [...new Set(Object.values(d.tasks_by_owner).flatMap((o) => Object.keys(o)))].sort();
  $("#tile-owner-status").innerHTML = table(["Owner", ...statuses, "Total"],
    Object.entries(d.tasks_by_owner).map(([o, c]) => [esc(o), ...statuses.map((s) => `<span class="${cls(s)}">${c[s] || 0}</span>`),
      Object.values(c).reduce((a, b) => a + b, 0)]));
  $("#tile-deadlines").innerHTML = d.deadlines.length ? table(["Date", "Owner", "What"],
    d.deadlines.map((x) => [esc(x.date + (x.time ? " " + x.time : "")), esc(x.owner), esc(x.what)])) : "<p class=mut>None</p>";
  const max = Math.max(1, ...d.pipeline.map((p) => p.count));
  $("#tile-pipeline").innerHTML = table(["Stage", "Count", ""],
    d.pipeline.map((p) => [esc(p.stage), p.count, `<span class="bar" style="width:${Math.round(120 * p.count / max)}px"></span>`]));
  $("#tile-unknowns").innerHTML = `<div class="big">${d.counts.open_unknowns}</div><p class="mut">items marked UNKNOWN across team records.<br>
    Tasks: ${d.counts.tasks} · Decisions: ${d.counts.decisions} · Redacted titles: ${d.counts.redacted}</p>`;
  $("#tile-next").innerHTML = table(["Agent", "Next step"], Object.entries(d.next_steps).map(([a, s]) => [esc(a), esc(s || "-")]));
  $("#tile-decisions").innerHTML = table(["#", "Title"], d.decisions.map((x) => [esc(x.number), esc(x.title)]));
  $("#tile-tasks").innerHTML = table(["ID", "Title", "Owner", "Status", "Deadline"],
    d.tasks.map((t) => [esc(t.id), esc(t.title), esc(t.owner), `<span class="${cls(t.status)}">${esc(t.status)}</span>`, esc(t.deadline || "")]));
}).catch(() => { document.querySelector("main").insertAdjacentHTML("afterbegin", "<p>Could not load data.json</p>"); });
