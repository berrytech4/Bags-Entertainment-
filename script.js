const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTV2IK_BekiiJCzm1hNtE9K8p8GvCAOEcnVvJJisol9IDDiNAbSFRM180kGkgmlFw/pub?output=csv"; // Paste your CSV link here
let tickets = [];

// Load CSV Data
fetch(sheetURL)
  .then((res) => res.text())
  .then((data) => {
    tickets = data
      .split("\n")
      .slice(1)
      .map((line) => {
        const [TicketCode, Status, Name] = line.split(",");
        return {
          TicketCode: TicketCode?.replace(/"/g, "").trim(),
          Status: Status?.replace(/"/g, "").trim(),
          Name: Name?.replace(/"/g, "").trim(),
        };
      });
    console.log("Loaded Tickets:", tickets.length);
  })
  .catch((err) => console.error("Error loading data:", err));

function verifyTicket() {
  const input = document.getElementById("ticketInput").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.className = "";

  if (!input) {
    resultDiv.textContent = "❌ Please enter a ticket code!";
    resultDiv.classList.add("notfound");
    return;
  }

  const ticket = tickets.find(
    (t) => t.TicketCode?.toLowerCase() === input.toLowerCase()
  );

  if (!ticket) {
    resultDiv.textContent = "❌ Ticket not found!";
    resultDiv.classList.add("notfound");
  } else if (ticket.Status?.toLowerCase() === "used") {
    resultDiv.innerHTML = `⚠️ Ticket already used!<br>🎟️ Holder: <strong>${
      ticket.Name || "Unknown"
    }</strong>`;
    resultDiv.classList.add("used");
  } else {
    resultDiv.innerHTML = `✅ Ticket is valid!<br>🎟️ Holder: <strong>${
      ticket.Name || "Unknown"
    }</strong>`;
    resultDiv.classList.add("valid");
    startConfetti();
  }
}

// Confetti Celebration
function startConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ["#ffb6b9", "#fae3d9", "#bbded6", "#c7ceea"];

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
