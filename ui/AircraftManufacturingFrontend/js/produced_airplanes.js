document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://127.0.0.1:8000/api/produced-aircrafts/";
    const tableBody = document.querySelector("#airplanesTable tbody");

    fetchProducedAircrafts();

    function fetchProducedAircrafts() {
        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function (response) {
                populateTable(response);
            },
            error: function (xhr) {
                console.error("Error fetching produced aircrafts:", xhr.responseText);
                alert("Üretilen uçaklar alınırken bir hata oluştu.");
            },
        });
    }

    function populateTable(data) {
        tableBody.innerHTML = ""; 
        const groupedData = groupByAircraft(data);

        groupedData.forEach(aircraft => {
            const lastPart = aircraft.parts[aircraft.parts.length - 1];
            const formattedDate = formatDate(lastPart.created_at);

            const row = `
                <tr>
                    <td class="px-6 py-3">${aircraft.aircraft_name}</td>
                    <td class="px-6 py-3">${lastPart.part_name}</td>
                    <td class="px-6 py-3">${formattedDate}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    function groupByAircraft(data) {
        const grouped = data.reduce((acc, item) => {
            const existing = acc.find(a => a.aircraft === item.aircraft);
            if (existing) {
                existing.parts.push(item);
            } else {
                acc.push({
                    aircraft: item.aircraft,
                    aircraft_name: item.aircraft_name,
                    parts: [item],
                });
            }
            return acc;
        }, []);

        return grouped;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
});
