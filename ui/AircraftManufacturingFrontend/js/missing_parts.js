document.addEventListener("DOMContentLoaded", function () {
    const missingPartsContainer = document.getElementById("missingPartsContainer");

    fetch("http://127.0.0.1:8000/api/inventory-alerts/") 
        .then((response) => {
            if (!response.ok) {
                throw new Error("API isteği başarısız oldu.");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                missingPartsContainer.innerHTML = "<p>Eksik parça bulunmamaktadır.</p>";
                return;
            }

            data.forEach((item) => {
                const card = document.createElement("div");
                card.classList.add("card");

                card.innerHTML = `
                    <h3>${item.part_name}</h3>
                    <p>Eksik Miktar: <span class="stock">${item.missing_quantity}</span></p>
                    <p class="date">Tarih: ${new Date(item.created_at).toLocaleDateString()}</p>
                `;

                missingPartsContainer.appendChild(card);
            });
        })
        .catch((error) => {
            missingPartsContainer.innerHTML = `<p>Bir hata oluştu: ${error.message}</p>`;
            console.error("Eksik parçalar yüklenirken hata:", error);
        });
});
