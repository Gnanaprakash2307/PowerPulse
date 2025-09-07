// ----------------- LOGIN FUNCTION -----------------
function login() {
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  // Hardcoded passwords (replace with backend validation if needed)
  const credentials = {
    admin: "admin123",
    operator: "operator123"
  };

  if (password === credentials[role]) {
    // Save role in localStorage for dashboard use
    localStorage.setItem("userRole", role);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Incorrect password!";
  }
}


// ----------------- CHART SETUP -----------------
const ctx = document.getElementById("energyChart").getContext("2d");
const energyChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // timestamps
    datasets: [{
      label: "Voltage (V)",
      data: [],
      borderColor: "blue",
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: "Timestamp" } },
      y: { title: { display: true, text: "Voltage (V)" } }
    }
  }
});

// ----------------- GLOBAL VARIABLES -----------------
let totalEnergy = 0;  // Wh
let lastTimestamp = null;
let activeMachine = 1; // default machine = 1

// ----------------- FETCH + UPDATE -----------------
async function loadSensorData() {
  if (activeMachine !== 1) return; // only fetch if Machine 1 is active

  try {
    const response = await fetch("http://127.0.0.1:5000/getSensorData");
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) return;

    // Sort by timestamp (old → new)
    data.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    // Reset chart
    energyChart.data.labels = [];
    energyChart.data.datasets[0].data = [];

    // Loop through all data points
    data.forEach(item => {
      const V = item.voltage || 0;
      const I = item.current || 0;
      const PF = item.pf || 1;
      const ts = item.timestamp || Date.now();

      // --- POWER & ENERGY ---
      const power = V * I * PF;
      if (lastTimestamp) {
        const dt_sec = (ts - lastTimestamp) / 1000;
        const dt_hr = dt_sec / 3600;
        totalEnergy += power * dt_hr;
      }
      lastTimestamp = ts;

      // --- Update chart ---
      energyChart.data.labels.push(new Date(ts).toLocaleTimeString());
      energyChart.data.datasets[0].data.push(V);

      // --- Update latest cards with last reading ---
      if (item === data[data.length - 1]) {
        document.getElementById("voltage").textContent = V.toFixed(2);
        document.getElementById("current").textContent = I.toFixed(2);
        document.getElementById("power").textContent = power.toFixed(2) + " W";
        document.getElementById("energy").textContent = totalEnergy.toFixed(2) + " Wh";
        document.getElementById("totalCurrent").textContent = item.totalCurrent || "--";
        document.getElementById("totalVoltage").textContent = item.totalVoltage || "--";
      }
    });

    energyChart.update();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// ----------------- AUTO REFRESH -----------------
setInterval(loadSensorData, 5000);
loadSensorData();

// ----------------- EXTRA FUNCTIONS -----------------
function logout() {
  alert("Logged out!"); 
  window.location.href = "index.html";
}

function loadMachine(machineId) {
  if (machineId === 1) {
    activeMachine = 1;
    alert("Loading Machine 1...");
    loadSensorData();
  } else if (machineId === 2) {
    activeMachine = 0;
    alert("Machine 2: This feature is for future use.");
  }
}

function addMachine() {
  alert("Add new machine feature coming soon!");
}
