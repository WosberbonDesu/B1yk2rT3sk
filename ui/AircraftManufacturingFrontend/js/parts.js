// Dummy Data (Başlangıç için)
const parts = [
    { id: 1, name: "Kanat", team: "Kanat Takımı", quantity: 5 },
    { id: 2, name: "Gövde", team: "Gövde Takımı", quantity: 3 },
    { id: 3, name: "Kuyruk", team: "Kuyruk Takımı", quantity: 2 }
];

const partsTableBody = document.querySelector("#partsTable tbody");
const partModal = document.getElementById("partModal");
const partForm = document.getElementById("partForm");
const modalTitle = document.getElementById("modalTitle");
const addPartBtn = document.getElementById("addPartBtn");

let isEdit = false; 
let currentPartId = null;

const renderParts = () => {
    partsTableBody.innerHTML = "";
    parts.forEach(part => {
        const row = `
            <tr>
                <td class="px-6 py-3">${part.id}</td>
                <td class="px-6 py-3">${part.name}</td>
                <td class="px-6 py-3">${part.team}</td>
                <td class="px-6 py-3">${part.quantity}</td>
                <td class="px-6 py-3">
                    <button class="text-blue-500" onclick="editPart(${part.id})">Düzenle</button>
                    <button class="text-red-500" onclick="deletePart(${part.id})">Sil</button>
                </td>
            </tr>`;
        partsTableBody.innerHTML += row;
    });
};

partForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("partName").value;
    const team = document.getElementById("team").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (isEdit) {
        const part = parts.find(p => p.id === currentPartId);
        part.name = name;
        part.team = team;
        part.quantity = quantity;
        isEdit = false;
        currentPartId = null;
    } else {
        const newPart = { id: parts.length + 1, name, team, quantity };
        parts.push(newPart);
    }

    renderParts();
    closeModal();
});

const editPart = (id) => {
    const part = parts.find(p => p.id === id);
    document.getElementById("partName").value = part.name;
    document.getElementById("team").value = part.team;
    document.getElementById("quantity").value = part.quantity;

    modalTitle.innerText = "Parça Düzenle";
    isEdit = true;
    currentPartId = id;

    openModal();
};

const deletePart = (id) => {
    const index = parts.findIndex(p => p.id === id);
    if (index !== -1) parts.splice(index, 1);
    renderParts();
};

const openModal = () => partModal.classList.remove("hidden");
const closeModal = () => partModal.classList.add("hidden");

addPartBtn.addEventListener("click", () => {
    modalTitle.innerText = "Yeni Parça Ekle";
    partForm.reset();
    openModal();
});

renderParts();
