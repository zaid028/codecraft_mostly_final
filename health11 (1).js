// Initialize heart rate chart and blood pressure chart
let heartRateChart = new Chart(document.getElementById('heartRateChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],  // Time or iteration data can be added here
    datasets: [{
      label: 'Heart Rate (bpm)',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 200
      }
    }
  }
});

// Initialize blood pressure chart
let bloodPressureChart = new Chart(document.getElementById('bloodPressureChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Blood Pressure (mmHg)',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    scales: {
      y: {
        min: 50,
        max: 200
      }
    }
  }
});

// Simulate a dynamic heart rate change (for example, random values)
function simulateHeartRate() {
  let currentTime = new Date().toLocaleTimeString();
  let heartRate = Math.floor(Math.random() * (140 - 60 + 1)) + 60;  // Random heart rate between 60 and 140 bpm
  
  // Update Heart Rate chart with new data
  heartRateChart.data.labels.push(currentTime);
  heartRateChart.data.datasets[0].data.push(heartRate);
  
  if (heartRateChart.data.labels.length > 10) {
    heartRateChart.data.labels.shift();  // Keep only the last 10 data points
    heartRateChart.data.datasets[0].data.shift();
  }
  heartRateChart.update();
}

// Update blood pressure chart when form is submitted
document.getElementById('healthForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const heartRate = parseInt(document.getElementById('heartRate').value);
  const bloodPressure = document.getElementById('bloodPressure').value.split('/').map(Number);

  // Validate inputs
  if (!heartRate && heartRate !== 0) {
    alert('Please enter valid health data');
    return;
  }

  // Show loading state
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<div class="text-center">Processing...</div>`;
  resultDiv.className = 'alert alert-info text-center';

  // Heart rate and blood pressure checks
  if (heartRate === 0) {
    resultDiv.innerHTML = `
      <h4>Status: Deceased</h4>
      <p>With deep condolences, the heart rate is 0. Please contact authorities and family members immediately.</p>
    `;
    resultDiv.className = 'mt-4 text-center alert alert-dark';
  } else if (heartRate > 140) {
    
    resultDiv.innerHTML = `
      <h4>Status: Critical - High Heart Rate</h4>
      <p>Your heart rate is above 140 bpm, indicating a potential heart attack risk. Seek medical attention immediately.</p>
    `;
    alert("SOS triggered! Notifications have been sent to your family and nearby hospitals.");

    resultDiv.className = 'mt-4 text-center alert alert-danger';
    await notifyHospitals(heartRate, bloodPressure); // Notify hospitals
  } else if (heartRate < 65) {
    resultDiv.innerHTML = `
      <h4>Status: Critical - Low Heart Rate</h4>
      <p>Your heart rate is below 65 bpm, indicating a critical condition. Seek medical attention immediately.</p>
    `;
    alert("SOS triggered! Notifications have been sent to your family and nearby hospitals.");

    resultDiv.className = 'mt-4 text-center alert alert-danger';
    await notifyHospitals(heartRate, bloodPressure); // Notify hospitals
  } else if (heartRate >= 120) {
    resultDiv.innerHTML = `
      <h4>Status: Above Normal</h4>
      <p>Your heart rate is ${heartRate} bpm, which is higher than normal. Please take some rest and monitor your condition.</p>
    `;
    alert("Please take care of yourself and take some rest");
    resultDiv.className = 'mt-4 text-center alert alert-warning';
  } else {
    resultDiv.innerHTML = `
      <h4>Status: Normal</h4>
      <p>Your heart rate is ${heartRate} bpm. Everything looks fine. Keep up the healthy lifestyle!</p>
    `;
    resultDiv.className = 'mt-4 text-center alert alert-success';
  }

  // Update the charts with the new data
  let currentTime = new Date().toLocaleTimeString();
  
  // Update Blood Pressure chart
  let systolic = bloodPressure[0];
  let diastolic = bloodPressure[1];
  
  bloodPressureChart.data.labels.push(currentTime);
  bloodPressureChart.data.datasets[0].data.push(systolic);
  if (bloodPressureChart.data.labels.length > 10) {
    bloodPressureChart.data.labels.shift();
    bloodPressureChart.data.datasets[0].data.shift();
  }
  bloodPressureChart.update();
});
// Simulate sending an SOS alert to hospitals and family members
function sendSOSAlert() {
  const resultDiv = document.getElementById('result');
  
  // Show alert message
  resultDiv.innerHTML = `
    <h4>Status: SOS Alert Sent!</h4>
    <p>Your SOS has been sent to nearby hospitals and your family members. Help is on the way.</p>
  `;
  resultDiv.className = 'mt-4 text-center alert alert-danger';

  // Simulate sending notifications
  notifyHospitalsSOS();
  notifyFamilyMembersSOS();
}

// Simulate notifying nearby hospitals
function notifyHospitalsSOS() {
  console.log('Sending SOS notification to nearby hospitals...');
  // You could replace this with an API call to notify hospitals
}

// Simulate notifying family members
function notifyFamilyMembersSOS() {
  console.log('Sending SOS notification to family members...');
  // You could replace this with an API call to notify family members
}

// Add an event listener to the SOS button
document.getElementById('sosButton').addEventListener('click', function() {
  sendSOSAlert();
});

// Simulate heart rate changes every 2 seconds
setInterval(simulateHeartRate, 2000);
