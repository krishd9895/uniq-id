async function fetchData() {
  const response = await fetch('data.json');
  return await response.json();
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

  const projectCode = season + district + cropCode + villageCode;
  document.getElementById("project-code").innerText = projectCode;

  // Show the copy button
  document.getElementById("copy-button").style.display = "inline";
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
  const projectCode = document.getElementById("project-code").innerText;
  navigator.clipboard.writeText(projectCode).then(() => {
    alert("Unique Id copied to clipboard: " + projectCode);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
});
