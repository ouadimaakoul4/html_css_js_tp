// Attendre que le document HTML soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments du DOM nécessaires
    const addProductForm = document.getElementById('addProductForm'); // Formulaire d'ajout de produit
    const editProductForm = document.getElementById('editProductForm'); // Formulaire de modification de produit
    const cancelEditButton = document.getElementById('cancelEdit'); // Bouton pour annuler la modification
    const productsContainer = document.getElementById('productsContainer'); // Conteneur pour afficher les produits

    let db; // Variable pour stocker la connexion à la base de données IndexedDB
    let currentProductId = null; // Variable pour stocker l'ID du produit en cours de modification

    // Ouvrir ou créer la base de données IndexedDB nommée 'LibrairieDB' avec la version 1
    const request = indexedDB.open('LibrairieDB', 1);

    // Gérer la création ou la mise à jour de la base de données
    request.onupgradeneeded = function (event) {
        db = event.target.result; // Récupérer la connexion à la base de données
        // Vérifier si le store 'products' existe déjà
        if (!db.objectStoreNames.contains('products')) {
            // Créer un nouveau store 'products' avec 'id' comme clé primaire
            db.createObjectStore('products', { keyPath: 'id' });
        }
    };

    // Gérer la réussite de l'ouverture de la base de données
    request.onsuccess = function (event) {
        db = event.target.result; // Récupérer la connexion à la base de données
        loadProducts(); // Charger les produits après l'ouverture de la base de données
    };

    // Gérer les erreurs lors de l'ouverture de la base de données
    request.onerror = function (event) {
        console.error('Erreur lors de l\'ouverture de la base de données', event.target.error);
    };

    // Fonction pour charger les produits depuis IndexedDB et les afficher dans le DOM
    function loadProducts() {
        const transaction = db.transaction(['products'], 'readonly'); // Démarrer une transaction en lecture seule
        const store = transaction.objectStore('products'); // Accéder au store 'products'
        const request = store.getAll(); // Récupérer tous les produits du store

        // Gérer la réussite de la récupération des produits
        request.onsuccess = function (event) {
            const products = event.target.result; // Récupérer les produits
            productsContainer.innerHTML = ''; // Vider le conteneur des produits
            // Ajouter chaque produit au DOM
            products.forEach(product => addProductToDOM(product));
        };

        // Gérer les erreurs lors du chargement des produits
        request.onerror = function (event) {
            console.error('Erreur lors du chargement des produits', event.target.error);
        };
    }

    // Fonction pour ajouter un produit au DOM
    function addProductToDOM(product) {
        const productItem = document.createElement('div'); // Créer un nouvel élément div
        productItem.classList.add('product-item'); // Ajouter une classe CSS à l'élément
        // Remplir l'élément avec les informations du produit
        productItem.innerHTML = `
            <span><strong>${product.name}</strong> - ${product.category}</span>
            <span>Prix HT: ${product.priceHT.toFixed(2)} DH-TVA (20%): ${(product.priceHT * 0.20).toFixed(2)} DH-Prix TTC: ${(product.priceHT * 1.20).toFixed(2)} DH</span>
            <button onclick="editProduct(${product.id})">Modifier</button>
            <button onclick="deleteProduct(${product.id})">Supprimer</button>
        `;
        productsContainer.appendChild(productItem); // Ajouter l'élément au conteneur des produits
    }

    // Fonction pour afficher le formulaire de modification d'un produit
    window.editProduct = function (id) {
        const transaction = db.transaction(['products'], 'readonly'); // Démarrer une transaction en lecture seule
        const store = transaction.objectStore('products'); // Accéder au store 'products'
        const request = store.get(id); // Récupérer le produit avec l'ID spécifié

        // Gérer la réussite de la récupération du produit
        request.onsuccess = function (event) {
            const product = event.target.result; // Récupérer le produit
            if (product) {
                // Remplir le formulaire de modification avec les données du produit
                document.getElementById('editProductName').value = product.name;
                document.getElementById('editProductCategory').value = product.category;
                document.getElementById('editPriceHT').value = product.priceHT;
                currentProductId = product.id; // Stocker l'ID du produit en cours de modification
                editProductForm.classList.remove('hidden'); // Afficher le formulaire de modification
            }
        };

        // Gérer les erreurs lors de la récupération du produit
        request.onerror = function (event) {
            console.error('Erreur lors de la récupération du produit', event.target.error);
        };
    };

    // Gérer la soumission du formulaire de modification
    editProductForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Empêcher le rechargement de la page
        // Récupérer les nouvelles valeurs du formulaire
        const name = document.getElementById('editProductName').value;
        const category = document.getElementById('editProductCategory').value;
        const priceHT = parseFloat(document.getElementById('editPriceHT').value);

        const transaction = db.transaction(['products'], 'readwrite'); // Démarrer une transaction en lecture/écriture
        const store = transaction.objectStore('products'); // Accéder au store 'products'
        const request = store.get(currentProductId); // Récupérer le produit en cours de modification

        // Gérer la réussite de la récupération du produit
        request.onsuccess = function (event) {
            const product = event.target.result; // Récupérer le produit
            if (product) {
                // Mettre à jour les propriétés du produit
                product.name = name;
                product.category = category;
                product.priceHT = priceHT;
                store.put(product); // Mettre à jour le produit dans le store
                loadProducts(); // Recharger les produits dans le DOM
                editProductForm.classList.add('hidden'); // Masquer le formulaire de modification
            }
        };

        // Gérer les erreurs lors de la modification du produit
        request.onerror = function (event) {
            console.error('Erreur lors de la modification du produit', event.target.error);
        };
    });

    // Gérer l'annulation de la modification
    cancelEditButton.addEventListener('click', function () {
        editProductForm.classList.add('hidden'); // Masquer le formulaire de modification
    });

    // Gérer la soumission du formulaire d'ajout de produit
    addProductForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Empêcher le rechargement de la page
        // Récupérer les valeurs du formulaire
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const priceHT = parseFloat(document.getElementById('priceHT').value);

        // Créer un nouvel objet produit avec un ID unique (timestamp)
        const newProduct = {
            id: Date.now(), // Utilisation du timestamp comme ID unique
            name,
            category,
            priceHT
        };

        const transaction = db.transaction(['products'], 'readwrite'); // Démarrer une transaction en lecture/écriture
        const store = transaction.objectStore('products'); // Accéder au store 'products'
        const request = store.add(newProduct); // Ajouter le nouveau produit au store

        // Gérer la réussite de l'ajout du produit
        request.onsuccess = function () {
            addProductToDOM(newProduct); // Ajouter le produit au DOM
            addProductForm.reset(); // Réinitialiser le formulaire d'ajout
        };

        // Gérer les erreurs lors de l'ajout du produit
        request.onerror = function (event) {
            console.error('Erreur lors de l\'ajout du produit', event.target.error);
        };
    });

    // Fonction pour supprimer un produit
    window.deleteProduct = function (id) {
        const transaction = db.transaction(['products'], 'readwrite'); // Démarrer une transaction en lecture/écriture
        const store = transaction.objectStore('products'); // Accéder au store 'products'
        const request = store.delete(id); // Supprimer le produit avec l'ID spécifié

        // Gérer la réussite de la suppression du produit
        request.onsuccess = function () {
            loadProducts(); // Recharger les produits dans le DOM
        };

        // Gérer les erreurs lors de la suppression du produit
        request.onerror = function (event) {
            console.error('Erreur lors de la suppression du produit', event.target.error);
        };
    };
});