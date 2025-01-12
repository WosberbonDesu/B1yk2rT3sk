// Dummy Veriler
$(document).ready(function (){
    var eid = localStorage.getItem('eid');
    var team = localStorage.getItem('team');

alert(eid);
});
document.addEventListener("DOMContentLoaded", function () {
    const userTeam = localStorage.getItem('team');

    // Show the "Üretilen Uçaklar" button only for Montaj Takımı
    if (userTeam === "Montaj Takımı") {
        document.getElementById("viewProducedAirplanesBtn").classList.remove("hidden");
    }
});

document.getElementById("producePartsBtn").addEventListener("click", function () {
    const eid = localStorage.getItem('eid');
    const team = localStorage.getItem('team');
    window.location.href = `create_parts.html?eid=${eid}&team=${team}`;
});

document.getElementById("viewProducedAirplanesBtn").addEventListener("click", function () {
    window.location.href = "produced_airplanes.html";
});
// "Parça Üret" butonuna tıklama işlemi
document.getElementById("producedaa").addEventListener("click", function () {
    // panel.html sayfasına yönlendir
    window.location.href = "panel.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const userNameElement = document.getElementById("userName");
    const userTeamElement = document.getElementById("userTeam");

    const eid = localStorage.getItem('eid');
    const team = localStorage.getItem('team');

    if (eid && team) {
        userNameElement.textContent = `Kullanıcı ID: ${eid}`;
        userTeamElement.textContent = team;
    } else {
        console.error("localStorage değerleri eksik!");
    }
});
document.getElementById("viewTeamMembersBtn").addEventListener("click", function () {
    window.location.href = "team-mates.html"; 

document.getElementById("viewMissingPartsBtn").addEventListener("click", () => {
    window.location.href = "missing_part.html";
});

$(document).ready(function () {
    var eid = localStorage.getItem('eid'); 
    var userTeamId = null; 
    $.ajax({
        url: `http://127.0.0.1:8000/api/employees/${eid}/`,
        type: "GET",
        success: function (userResponse) {
            userTeamId = userResponse.team; 

            $.ajax({
                url: "http://127.0.0.1:8000/api/teams/",
                type: "GET",
                success: function (teamResponse) {
                   
                    teamResponse.forEach(function (team) {
                        var teamClass = team.id === userTeamId ? "green" : "blue"; 
                        var teamBox = `
                            <div class="team-box ${teamClass}">
                                <h3>${team.name}</h3>
                                <p>Sorumlu Parça ID: ${team.responsible_part_id}</p>
                            </div>
                        `;
                        $("#teamList").append(teamBox); 
                    });
                },
                error: function (xhr) {
                    console.error("Takımlar alınamadı:", xhr.responseText);
                    alert("Takımlar alınırken bir hata oluştu.");
                }
            });
        },
        error: function (xhr) {
            console.error("Kullanıcı bilgisi alınamadı:", xhr.responseText);
            alert("Kullanıcı bilgisi alınırken bir hata oluştu.");
        }
    });
});


const parts = [
    { name: "Kanat", team: "Kanat Takımı", quantity: 10 },
    { name: "Gövde", team: "Gövde Takımı", quantity: 5 },
    { name: "Kuyruk", team: "Kuyruk Takımı", quantity: 4 },
    { name: "Aviyonik", team: "Aviyonik Takımı", quantity: 6 }
];

const airplanes = {
    TB2: { requiredParts: { Kanat: 2, Gövde: 1, Kuyruk: 1, Aviyonik: 1 } },
    TB3: { requiredParts: { Kanat: 2, Gövde: 1, Kuyruk: 1, Aviyonik: 1 } },
    AKINCI: { requiredParts: { Kanat: 4, Gövde: 2, Kuyruk: 2, Aviyonik: 2 } },
    KIZILELMA: { requiredParts: { Kanat: 2, Gövde: 1, Kuyruk: 1, Aviyonik: 3 } }
};

const producedAirplanes = [];

const personnelTeam = document.getElementById("personnelTeam");
const airplaneSelect = document.getElementById("airplaneSelect");
const partsTableBody = document.querySelector("#partsTable tbody");
const addPartBtn = document.getElementById("addPartBtn");
const assembleBtn = document.getElementById("assembleBtn");
const warningMessage = document.getElementById("warningMessage");
const successMessage = document.getElementById("successMessage");
const producedAirplanesContainer = document.getElementById("producedAirplanesContainer");

const renderPartsTable = () => {
    partsTableBody.innerHTML = "";
    parts.forEach(part => {
        const row = `
            <tr>
                <td class="px-6 py-3">${part.name}</td>
                <td class="px-6 py-3">${part.team}</td>
                <td class="px-6 py-3">${part.quantity}</td>
                <td class="px-6 py-3">
                    <button class="text-blue-500" onclick="editPart('${part.name}')">Düzenle</button>
                    <button class="text-red-500" onclick="deletePart('${part.name}')">Sil</button>
                </td>
            </tr>`;
        partsTableBody.innerHTML += row;
    });
};

addPartBtn.addEventListener("click", () => {
    const team = personnelTeam.value;
    const partName = prompt("Yeni Parça Adını Girin:");
    const quantity = parseInt(prompt("Stok Miktarını Girin:"), 10);

    if (parts.find(p => p.name === partName)) {
        alert("Bu parça zaten mevcut!");
        return;
    }

    if (!partName || isNaN(quantity) || quantity <= 0) {
        alert("Geçerli bir değer girin!");
        return;
    }

    parts.push({ name: partName, team, quantity });
    renderPartsTable();
});

const editPart = (partName) => {
    const part = parts.find(p => p.name === partName);
    if (!part) return;

    const newQuantity = parseInt(prompt(`Yeni Stok Miktarı (${part.quantity}):`), 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
        alert("Geçerli bir stok miktarı girin!");
        return;
    }

    part.quantity = newQuantity;
    renderPartsTable();
};

const deletePart = (partName) => {
    const index = parts.findIndex(p => p.name === partName);
    if (index !== -1) parts.splice(index, 1);
    renderPartsTable();
};

const assembleAirplane = () => {
    const selectedAirplane = airplaneSelect.value;
    const requiredParts = airplanes[selectedAirplane].requiredParts;

    let hasMissingParts = false;
    const usedParts = {};

    Object.keys(requiredParts).forEach(partName => {
        const requiredQuantity = requiredParts[partName];
        const part = parts.find(p => p.name === partName);

        if (!part || part.quantity < requiredQuantity) {
            hasMissingParts = true;
        } else {
            usedParts[partName] = requiredQuantity;
        }
    });

    if (hasMissingParts) {
        warningMessage.classList.remove("hidden");
        successMessage.classList.add("hidden");
    } else {
        Object.keys(usedParts).forEach(partName => {
            const part = parts.find(p => p.name === partName);
            part.quantity -= usedParts[partName];
        });

        producedAirplanes.push({
            name: selectedAirplane,
            parts: usedParts,
            productionDate: new Date().toISOString().split("T")[0]
        });

        renderProducedAirplanes();
        warningMessage.classList.add("hidden");
        successMessage.classList.remove("hidden");
        renderPartsTable();
    }
};

const airplaneBody = document.getElementById("airplaneBody");
const leftWing = document.getElementById("leftWing");
const rightWing = document.getElementById("rightWing");
const tail = document.getElementById("tail");
const avionics = document.getElementById("avionics");

const updateAirplaneVisualization = () => {
    const selectedAirplane = airplaneSelect.value;
    const requiredParts = airplanes[selectedAirplane].requiredParts;

    airplaneBody.style.backgroundColor = "gray";
    leftWing.style.backgroundColor = "gray";
    rightWing.style.backgroundColor = "gray";
    tail.style.backgroundColor = "gray";
    avionics.style.backgroundColor = "gray";

    Object.keys(requiredParts).forEach(partName => {
        const requiredQuantity = requiredParts[partName];
        const part = parts.find(p => p.name === partName);

        const isPartAvailable = part && part.quantity >= requiredQuantity;

        if (partName === "Kanat") {
            leftWing.style.backgroundColor = isPartAvailable ? "blue" : "red";
            rightWing.style.backgroundColor = isPartAvailable ? "blue" : "red";
            leftWing.textContent = isPartAvailable ? "Kanat ✔" : "Kanat ❌";
            rightWing.textContent = isPartAvailable ? "Kanat ✔" : "Kanat ❌";
        } else if (partName === "Gövde") {
            airplaneBody.style.backgroundColor = isPartAvailable ? "blue" : "red";
            airplaneBody.textContent = isPartAvailable ? "Gövde ✔" : "Gövde ❌";
        } else if (partName === "Kuyruk") {
            tail.style.backgroundColor = isPartAvailable ? "blue" : "red";
            tail.textContent = isPartAvailable ? "Kuyruk ✔" : "Kuyruk ❌";
        } else if (partName === "Aviyonik") {
            avionics.style.backgroundColor = isPartAvailable ? "blue" : "red";
            avionics.textContent = isPartAvailable ? "Aviyonik ✔" : "Aviyonik ❌";
        }
    });
};

airplaneSelect.addEventListener("change", updateAirplaneVisualization);

assembleBtn.addEventListener("click", updateAirplaneVisualization);

updateAirplaneVisualization();


const renderProducedAirplanes = () => {
    producedAirplanesContainer.innerHTML = "";
    producedAirplanes.forEach(airplane => {
        const card = `
            <div class="bg-white rounded-lg shadow-md p-4">
                <h3 class="text-lg font-bold">${airplane.name}</h3>
                <p class="text-sm text-gray-600">Üretim Tarihi: ${airplane.productionDate}</p>
                <ul class="mt-2">
                    ${Object.entries(airplane.parts)
                        .map(([part, qty]) => `<li>${part}: ${qty} adet</li>`)
                        .join("")}
                </ul>
            </div>`;
        producedAirplanesContainer.innerHTML += card;
    });
};

personnelTeam.addEventListener("change", renderPartsTable);
assembleBtn.addEventListener("click", assembleAirplane);
renderPartsTable();
renderProducedAirplanes();
