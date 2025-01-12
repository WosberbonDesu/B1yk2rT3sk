$(document).ready(function () {
    // Üretilen uçakları listeleme
    function fetchProducedAircrafts() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/produced-aircrafts/",
            type: "GET",
            success: function (response) {
                const tableBody = $("#producedAircraftsTable tbody");
                tableBody.empty();
                for (const [key, aircraft] of Object.entries(response)) {
                    const usedParts = aircraft.used_parts
                        .map((part) => `${part.part_name} (${part.used_quantity})`)
                        .join(", ");
                    const row = `
                        <tr>
                            <td class="px-6 py-3">${aircraft.aircraft_name}</td>
                            <td class="px-6 py-3">${usedParts}</td>
                            <td class="px-6 py-3">${new Date().toLocaleDateString()}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                }
            },
            error: function () {
                alert("Üretilen uçaklar yüklenirken bir hata oluştu.");
            },
        });
    }

    function fetchMissingParts() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/missing-parts/",
            type: "GET",
            success: function (response) {
                const tableBody = $("#missingPartsTable tbody");
                tableBody.empty();
                response.forEach((part) => {
                    const row = `
                        <tr>
                            <td class="px-6 py-3">${part.part_name}</td>
                            <td class="px-6 py-3">${part.missing_quantity}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
            },
            error: function () {
                alert("Eksik parçalar yüklenirken bir hata oluştu.");
            },
        });
    }

    $("#produceAircraftBtn").click(function (e) {
        e.preventDefault();
        const selectedAircraft = $("#aircraftSelect").val();
        $.ajax({
            url: `http://127.0.0.1:8000/api/aircrafts/${selectedAircraft}/production/`,
            type: "POST",
            success: function () {
                alert("Uçak başarıyla üretildi.");
                fetchProducedAircrafts(); // Üretilen uçakları yeniden yükle
            },
            error: function (xhr) {
                const error = xhr.responseJSON?.error || "Üretim sırasında bir hata oluştu.";
                alert(`Hata: ${error}`);
            },
        });
    });

    fetchProducedAircrafts();
    fetchMissingParts();
});
