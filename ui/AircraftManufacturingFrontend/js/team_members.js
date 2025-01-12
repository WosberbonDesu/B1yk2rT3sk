$(document).ready(function () {
    const employeeId = localStorage.getItem("eid"); 
    const apiUrl = `http://127.0.0.1:8000/api/team-members/${employeeId}/`;

    function fetchTeamMembers() {
        $.ajax({
            url: apiUrl,
            type: "GET",
            success: function (response) {
                const tableBody = $("#teamMembersTable tbody");
                tableBody.empty(); 
                response.forEach(member => {
                    const row = `
                        <tr>
                            <td class="px-6 py-3">${member.first_name}</td>
                            <td class="px-6 py-3">${member.last_name}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
            },
            error: function () {
                alert("Takım arkadaşları yüklenirken bir hata oluştu.");
            }
        });
    }

    fetchTeamMembers();
});
