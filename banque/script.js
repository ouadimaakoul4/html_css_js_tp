let clients = [];
let accountNumberCounter = 1;

function createAccount() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;

    if (name && address && email) {
        const client = {
            accountNumber: accountNumberCounter++,
            name: name,
            address: address,
            email: email,
            balance: 0
        };
        clients.push(client);
        alert(`Compte créé avec succès! Numéro de compte: ${client.accountNumber}`);
        updateClientList();
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

function deposit() {
    const accountNumber = parseInt(document.getElementById('accountNumber').value);
    const amount = parseFloat(document.getElementById('amount').value);

    const client = clients.find(c => c.accountNumber === accountNumber);
    if (client && amount > 0) {
        client.balance += amount;
        alert(`Dépôt réussi! Nouveau solde: ${client.balance}`);
        updateClientList();
    } else {
        alert('Numéro de compte invalide ou montant incorrect.');
    }
}

function withdraw() {
    const accountNumber = parseInt(document.getElementById('accountNumber').value);
    const amount = parseFloat(document.getElementById('amount').value);

    const client = clients.find(c => c.accountNumber === accountNumber);
    if (client && amount > 0 && client.balance >= amount) {
        client.balance -= amount;
        alert(`Retrait réussi! Nouveau solde: ${client.balance}`);
        updateClientList();
    } else {
        alert('Numéro de compte invalide, montant incorrect ou solde insuffisant.');
    }
}

function updateClientList() {
    const clientList = document.getElementById('clients');
    clientList.innerHTML = '';
    clients.forEach(client => {
        const li = document.createElement('li');
        li.textContent = `Numéro: ${client.accountNumber}, Nom: ${client.name}, Adresse: ${client.address}, Email: ${client.email}, Solde: ${client.balance}`;
        clientList.appendChild(li);
    });
}