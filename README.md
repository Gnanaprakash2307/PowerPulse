# ⚡ Smart Energy Monitoring System

A real-time energy monitoring system using **ESP32** and **sensors**, with data logging to **Firebase** and a live **web dashboard**.

---

## 📌 Overview

This project monitors:

- **Voltage (V)**
- **Current (A)**
- **Power Factor (PF)**
- **Energy (Wh)**

Data is sent to **Firebase Realtime Database** and displayed on a **dashboard** with live graphs and role-based access.

---

## 🛠️ Features

- Real-time monitoring of electrical parameters
- Firebase integration for data logging
- Web dashboard with:
  - Voltage, Current, Power, Energy readings
  - Moving graph of sensor values
  - Role-based login (**Admin / Operator**)
- Operator role has limited access (cannot add new machines)

---

## 🔧 Hardware Required

- ESP32 Dev Board  
- ZMPT101B Voltage Sensor  
- ACS712 Current Sensor  
- DHT22 Temperature & Humidity Sensor  
- DS3231 RTC Module  
- Breadboard & Jumper Wires  

---

## 💾 Software / Libraries

**Arduino IDE Libraries:**
- WiFi.h (ESP32)
- FirebaseESP32 by Mobizt
- DHT sensor library by Adafruit
- RTClib by Adafruit

**Web:**
- HTML, CSS, JavaScript
- Chart.js for graphs

---

## ⚡ Installation

1. Install required **Arduino libraries**
2. Upload the ESP32 code (`ESP32_Firebase.ino`) to your board
3. Open `dashboard.html` in your browser
4. Log in as Admin or Operator to view readings

---

## 📁 Project Structure

/project-root
│
├─ ESP32_Firebase.ino # Arduino code for ESP32 sensors
├─ dashboard.html # Web dashboard
├─ script.js # JS for fetching and plotting data
├─ style.css # Dashboard styling
└─ README.md


---

## 🔮 Future Improvements

- Add more machines & sensors
- Export reports automatically
- Improve dashboard UI with real-time alerts

---
