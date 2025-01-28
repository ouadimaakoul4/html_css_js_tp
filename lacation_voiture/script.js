let cars = [];
let rentedCars = [];

// Ajouter une voiture
function addCar() {
    const brand = document.getElementById('carBrand').value;
    const model = document.getElementById('carModel').value;
    const year = parseInt(document.getElementById('carYear').value);
    const plate = document.getElementById('carPlate').value;

    if (brand && model && year && plate) {
        const car = {
            brand: brand,
            model: model,
            year: year,
            plate: plate,
            rented: false
        };
        cars.push(car);
        alert(`Voiture ajoutée avec succès! Plaque: ${plate}`);
        updateCarList();
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

// Louer une voiture
function rentCar() {
    const plate = document.getElementById('rentPlate').value;
    const renterName = document.getElementById('renterName').value;

    const car = cars.find(c => c.plate === plate);

    if (car && !car.rented && renterName) {
        car.rented = true;
        car.renterName = renterName;
        rentedCars.push(car);
        alert(`Voiture louée avec succès à ${renterName}!`);
        updateCarList();
    } else {
        alert('Plaque invalide, voiture déjà louée ou nom du locataire manquant.');
    }
}

// Mettre à jour les listes de voitures
function updateCarList() {
    const carList = document.getElementById('carList');
    const rentedList = document.getElementById('rentedList');

    carList.innerHTML = '';
    rentedList.innerHTML = '';

    cars.forEach(car => {
        const li = document.createElement('li');
        li.textContent = `${car.brand} ${car.model} (${car.year}) - ${car.plate}`;
        if (!car.rented) {
            carList.appendChild(li);
        }
    });

    rentedCars.forEach(car => {
        const li = document.createElement('li');
        li.textContent = `${car.brand} ${car.model} (${car.year}) - ${car.plate} - Louée à ${car.renterName}`;
        rentedList.appendChild(li);
    });
}

// Initialisation de la liste des voitures
updateCarList();