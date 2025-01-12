$(document).ready(function () {
    const teamId = localStorage.getItem("team");

    function updateProductionTable() {
        $.ajax({
            url: `http://127.0.0.1:8000/api/production/`,
            type: "GET",
            success: function (response) {
                const tableBody = $("#productionTable tbody");
                tableBody.empty();
                response.forEach((production) => {
                    const row = `
                        <tr>
                            <td class="px-6 py-3">${production.part_name}</td>
                            <td class="px-6 py-3">${production.team_name}</td>
                            <td class="px-6 py-3">${production.quantity}</td>
                            <td class="px-6 py-3">
                                <button class="text-red-500 reduce-stock-btn" data-part-id="${production.part}">
                                    Stok Azalt
                                </button>
                                <button class="text-yellow-500 recycle-btn ml-4" data-part-id="${production.part}">
                                    Geri Dönüştür
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);
                });

                $(".reduce-stock-btn").click(function () {
                    const partId = $(this).data("part-id");
                    $.ajax({
                        url: `http://127.0.0.1:8000/api/parts/reduce-stock/`,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ part_id: partId, quantity: 1 }), 
                        success: function (response) {
                            alert(response.message);
                            updateProductionTable(); 
                        },
                        error: function (xhr) {
                            const error = xhr.responseJSON?.error || "Stok azaltılırken bir hata oluştu.";
                            alert(`Hata: ${error}`);
                        },
                    });
                });

                $(".recycle-btn").click(function () {
                    const partId = $(this).data("part-id");
                    $.ajax({
                        url: `http://127.0.0.1:8000/api/parts/recycle/`,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ part_id: partId, quantity: 1 }), 
                        success: function (response) {
                            alert(response.message);
                            updateProductionTable(); 
                        },
                        error: function (xhr) {
                            const error = xhr.responseJSON?.error || "Geri dönüşüm sırasında bir hata oluştu.";
                            alert(`Hata: ${error}`);
                        },
                    });
                });
            },
            error: function () {
                alert("Üretilen parçalar yüklenirken bir hata oluştu.");
            },
        });
    }

    $("#producePartBtn").click(function (e) {
        e.preventDefault();

        const selectedPart = $("#partSelect").val();
        const quantity = $("#quantity").val();

        if (!selectedPart || !quantity || quantity < 1) {
            alert("Lütfen geçerli bir parça ve miktar seçin.");
            return;
        }

        $.ajax({
            url: `http://127.0.0.1:8000/api/production/`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                team: teamId,
                part: selectedPart,
                quantity: quantity,
            }),
            success: function () {
                alert("Parça başarıyla üretildi.");
                updateProductionTable();
            },
            error: function (xhr) {
                const error = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu.";
                alert(`Hata: ${error}`);
            },
        });
    });

    updateProductionTable();
});
