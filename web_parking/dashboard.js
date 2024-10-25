const blynkAuthToken = 'po6V3XG9qb7bnsUw9g21VbVpY7JBvgYo';
const blynkParkingUrl = `https://blynk.cloud/external/api/get?token=${blynkAuthToken}&V0`;
const blynkLightUrl = `https://blynk.cloud/external/api/get?token=${blynkAuthToken}&V1`;
const blynkSliderUrl = `https://blynk.cloud/external/api/get?token=${blynkAuthToken}&V2`;
const blynkSetLightUrl = `https://blynk.cloud/external/api/update?token=${blynkAuthToken}&V1=`;
const blynkSetSliderUrl = `https://blynk.cloud/external/api/update?token=${blynkAuthToken}&V2=`;
let isLightOn = false;
let parkLimit = 3;

async function fetchParkingData() {
    try {
        const response = await fetch(blynkParkingUrl);
        const parkingData = await response.text();
        document.getElementById("parking-slots").textContent = parkingData;
    } catch (error) {
        console.error('Error fetching parking data:', error);
        document.getElementById("parking-slots").textContent = 'Error';
    }
}

async function fetchLightStatus() {
    try {
        const response = await fetch(blynkLightUrl);
        const lightData = await response.text();
        document.getElementById("light-status").textContent = lightData === "1" ? "ON" : "OFF";
    } catch (error) {
        console.error('Error fetching light status:', error);
        document.getElementById("light-status").textContent = 'Error';
    }
}



function toggleLight() {
    isLightOn = !isLightOn;
    /*const lightStatus = document.getElementById("light-status");*/
    const toggleButton = document.getElementById("toggle-button");

    if (isLightOn) {
        /*lightStatus.textContent = "ON";*/
        toggleButton.textContent = "ON";
        toggleButton.classList.remove("off");
        toggleButton.classList.add("on");
        fetch(blynkSetLightUrl + '1')
        .catch(error => console.error("Error:", error));
    } else {
        /*lightStatus.textContent = "OFF";*/
        toggleButton.textContent = "OFF";
        toggleButton.classList.remove("on");
        toggleButton.classList.add("off");
        fetch(blynkSetLightUrl + '0')
        .catch(error => console.error("Error:", error));
    }
}

function updateParkLimit() {
    fetch(blynkSliderUrl)
        .then(response => response.text())
        .then(data => {
            parkLimit = parseInt(data); // แปลงค่าที่ได้เป็นตัวเลข
            document.getElementById("park-limit").textContent = `Parking Limit: ${parkLimit}`;
        })
        .catch(error => console.error("Error fetching park_limit:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("park-limit-slider");
    const sliderValueDisplay = document.getElementById("slider-value-display");

    // ฟังก์ชันสำหรับส่งค่า slider ไปยัง Blynk
    function sendSliderValueToBlynk(value) {
        fetch(blynkSetSliderUrl + value)
            .then(response => {
                if (response.ok) {
                    console.log(`Slider value ${value} sent to Blynk`);
                } else {
                    console.error("Failed to send slider value to Blynk");
                }
            })
            .catch(error => console.error("Error:", error));
    }

    // การเพิ่ม Event Listener สำหรับ slider
    slider.addEventListener("input", () => {
        sliderValueDisplay.textContent = slider.value; // แสดงค่าของ slider
        sendSliderValueToBlynk(slider.value); // ส่งค่า slider ไปยัง Blynk
    });
});


function fetchData() {
    fetchParkingData();
    fetchLightStatus();
}

setInterval(fetchData, 5000);
fetchData();