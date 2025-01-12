const checkInventory = (requiredParts) => {
    const missingParts = requiredParts.filter(rp => {
        const part = parts.find(p => p.name === rp.name);
        return !part || part.quantity < rp.quantity;
    });

    if (missingParts.length > 0) {
        alert(`Eksik Parçalar: ${missingParts.map(mp => mp.name).join(", ")}`);
    } else {
        alert("Montaj için tüm parçalar mevcut!");
    }
};

checkInventory([{ name: "Kanat", quantity: 2 }, { name: "Gövde", quantity: 1 }]);
