async function fetchData() {
  let data;
  try {
    // Try fetching data.json directly
    const response = await fetch('data.json');
    data = await response.json();
  } catch (error) {
    console.error('Error fetching data.json directly:', error);
    // If fetching directly fails, attempt to read from secrets
    data = await fetchDataFromSecrets();
  }
  return data;
}

async function fetchDataFromSecrets() {
  try {
    // Read data.json from secrets
    const fs = require('fs').promises;
    const path = '/etc/secrets/data.json';
    const data = await fs.readFile(path, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data.json from secrets:', error);
    throw new Error('Failed to fetch data.json from both direct fetch and secrets');
  }
}



async function populateDropdowns() {
  const { crops, villages } = await fetchData();

  const cropSelect = document.getElementById("crop");
  crops.forEach(crop => {
    const option = document.createElement("option");
    option.value = crop.name.toLowerCase();
    option.textContent = crop.name;
    cropSelect.appendChild(option);
  });

  const villageSelect = document.getElementById("village");
  villages.forEach(village => {
    const option = document.createElement("option");
    option.value = village.name.toLowerCase();
    option.textContent = village.name;
    villageSelect.appendChild(option);
  });
}

async function generateCode() {
  const season = document.getElementById("season").value.charAt(0);
  const district = document.getElementById("district").value;
  const crop = document.getElementById("crop").value;
  const village = document.getElementById("village").value;

  const { crops, villages } = await fetchData();
  const cropCode = getCropCode(crops, crop);
  const villageCode = getVillageCode(villages, village);

  const Uniqueid = season + district + cropCode + villageCode;
  document.getElementById("Unique_id").innerText = Uniqueid;

  // Show the copy button
  document.getElementById("copy-button").style.display = "inline";

  // Find the village object
  const selectedVillage = villages.find(v => v.name.toLowerCase() === village.toLowerCase());
  if (selectedVillage) {
    const highestSyNo = selectedVillage.highest_sy_no;
    document.getElementById("highest_sy_no").innerText = "Highest Sy No: " + highestSyNo;
  } else {
    document.getElementById("highest_sy_no").innerText = "";
  }


}



function getCropCode(crops, cropName) {
  const crop = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
  return crop ? crop.code : "";
}

function getVillageCode(villages, villageName) {
  const village = villages.find(v => v.name.toLowerCase() === villageName.toLowerCase());
  return village ? village.code : "";
}

populateDropdowns();

document.getElementById("generate-button").addEventListener("click", generateCode);

document.getElementById("copy-button").addEventListener("click", function() {
  const Uniqueid = document.getElementById("Unique_id").innerText;
  navigator.clipboard.writeText(Uniqueid).then(() => {
    alert("Unique Id copied to clipboard: " + Uniqueid);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
});
