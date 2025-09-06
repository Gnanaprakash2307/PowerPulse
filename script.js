// ---------------- LOGIN ----------------
function login() {
  const user = document.getElementById("role").value;
  const pass = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (user === "admin" && pass === "12") {
    localStorage.setItem("userRole", role);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-msg").innerText = "Invalid username or password!";
  }
}

// ---------------- DASHBOARD ----------------
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("energyChart").getContext("2d");

  const energyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [], 
      datasets: [{
        label: "Voltage",
        data: [],
        borderColor: "#00e5ff",
        borderWidth: 2,
      }],
    },
    options: { responsive: true },
  });

  let activeMachine = 1;

  // ---------------- Dummy data for Machine 2 ----------------
  const machine2Voltages = [220, 221, 225, 222, 220, 228, 226, 227];
  const machine2Currents = [8, 8.5, 8.2, 8.7, 9, 8.4, 8.1, 8.8];
  let machine2Index = 0;

  const machine2Data = {
    rms: 219,
    pf: 0.9,
    totalCurrent: 9,
    totalVoltage: 222,
    chart: [],
    labels: []
  };

  // ---------------- Load Machine ----------------
  function loadMachine(num) {
    activeMachine = num;

    if (num === 2) {
      const volt = machine2Voltages[machine2Index];
      const curr = machine2Currents[machine2Index];
      machine2Data.chart.push(volt);
      machine2Data.labels.push(new Date().toLocaleTimeString());

      document.getElementById("voltage").innerText = volt;
      document.getElementById("current").innerText = curr;
      document.getElementById("rms").innerText = machine2Data.rms;
      document.getElementById("pf").innerText = machine2Data.pf;
      document.getElementById("totalCurrent").innerText = machine2Data.totalCurrent;
      document.getElementById("totalVoltage").innerText = machine2Data.totalVoltage;

      energyChart.data.labels = [...machine2Data.labels];
      energyChart.data.datasets[0].data = [...machine2Data.chart];
      energyChart.update();

      // move index and loop
      machine2Index = (machine2Index + 1) % machine2Voltages.length;
    }
  }

  function addMachine() {
    alert("Add Machine feature coming soon!");
  }

  // ---------------- Fetch Firebase for Machine 1 ----------------
  async function fetchFirebaseData() {
    if (activeMachine !== 1) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/getSensorData");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const latest = data[data.length - 1];
      if (!latest.voltage) return;

      document.getElementById("voltage").innerText = latest.voltage;
      document.getElementById("current").innerText = latest.current;
      document.getElementById("temperature").innerText = latest.temperature;

      const timeLabel = new Date().toLocaleTimeString();
      energyChart.data.labels.push(timeLabel);
      energyChart.data.datasets[0].data.push(latest.voltage);

      if (energyChart.data.labels.length > 10) {
        energyChart.data.labels.shift();
        energyChart.data.datasets[0].data.shift();
      }

      energyChart.update();
    } catch (err) {
      console.error("Error fetching Firebase data:", err);
    }
  }

  // ---------------- Simulate Machine 2 Data ----------------
  function simulateMachine2Data() {
    if (activeMachine !== 2) return;
    loadMachine(2);
    // Remove old points to keep last 10
    if (energyChart.data.labels.length > 10) {
      energyChart.data.labels.shift();
      energyChart.data.datasets[0].data.shift();
    }
  }

  // ---------------- Auto-refresh every 1 second ----------------
  setInterval(() => {
    fetchFirebaseData();
    simulateMachine2Data();
  }, 1000);

  // ---------------- Initial load ----------------
  loadMachine(1);
  window.loadMachine = loadMachine;
  window.addMachine = addMachine;
});
