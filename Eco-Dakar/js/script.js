/* =========================================
   ECODAKAR - SCRIPT PRINCIPAL
========================================= */


/* =========================================
   1. DONNÉES DES PRODUITS
========================================= */

const products = [

    {
        id: 1,
        name: "Poubelle Maison Classique",
        category: "Maison",
        description: "Modèle pratique pour les déchets quotidiens.",
        price: 5000,
        stock: 25,
        image: "image/produits/maison1.jpeg",
    },

    {
        id: 2,
        name: "Poubelle Maison Premium",
        category: "Maison",
        description: "Modèle avec couvercle pour un usage familial.",
        price: null,
        stock: 15,
        image: "image/produits/maison-2.jpeg"
    },

    {
        id: 3,
        name: "Poubelle Maison Grande Capacité",
        category: "Maison",
        description: "Adaptée aux familles et aux grands espaces.",
        price: null,
        stock: 10,
        image: "image/produits/maison-3.jpeg"
    },

    {
        id: 4,
        name: "Poubelle École Standard",
        category: "École",
        description: "Pour les salles de classe et les couloirs.",
        price: null,
        stock: 20,
        image: "image/produits/ecole-1.jpeg"
    },

    {
        id: 5,
        name: "Poubelle École Tri Sélectif",
        category: "École",
        description: "Pour encourager le tri des déchets.",
        price: null,
        stock: 12,
        image: "image/produits/ecole-2.jpeg"
    },

    {
        id: 6,
        name: "Poubelle École Grande Capacité",
        category: "École",
        description: "Pour les espaces scolaires très fréquentés.",
        price: null,
        stock: 8,
        image: "image/produits/ecole-3.jpeg"
    },

    

    {
        id: 10,
        name: "Poubelle Entreprise Standard",
        category: "Entreprise",
        description: "Pour les bureaux et les espaces professionnels.",
        price: null,
        stock: 18,
        image: "image/produits/entreprise-1.jpeg"
    },

    {
        id: 11,
        name: "Poubelle Entreprise Tri",
        category: "Entreprise",
        description: "Pour faciliter le tri dans les bureaux.",
        price: null,
        stock: 12,
        image: "image/produits/entreprise-2.jpeg"
    },

    {
        id: 12,
        name: "Poubelle Entreprise XL",
        category: "Entreprise",
        description: "Pour les grandes structures.",
        price: null,
        stock: 6,
        image: "image/produits/entreprise-3.jpeg"
    },

    {
        id: 13,
        name: "Poubelle Espace Public Standard",
        category: "Lieu public",
        description: "Pour les espaces collectifs.",
        price: null,
        stock: 20,
        image: "image/produits/lieu-public-1.jpeg"
    },

    {
        id: 14,
        name: "Poubelle Espace Public Tri",
        category: "Lieu public",
        description: "Pour organiser les déchets par catégorie.",
        price: null,
        stock: 12,
        image: "image/produits/lieu-public-2.jpeg"
    },

    {
        id: 15,
        name: "Poubelle Espace Public XL",
        category: "Lieu public",
        description: "Pour les zones à forte fréquentation.",
        price: null,
        stock: 8,
        image: "image/produits/lieu-public-3.jpeg"
    }

];


/* =========================================
   2. STOCKAGE LOCAL
========================================= */

function getData(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : fallback;

    } catch (error) {

        return fallback;

    }

}


function saveData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}


let cart = getData("eco_cart", []);

let orders = getData("eco_orders", []);

let users = getData("eco_users", []);

let currentUser = getData("eco_current_user", null);

let messages = getData("eco_messages", []);

let subscribers = getData("eco_subscribers", []);

let rewards = getData("eco_rewards", [

    {
        name: "Savons",
        stock: 100
    },

    {
        name: "Produits d'entretien",
        stock: 50
    },

    {
        name: "Fournitures scolaires",
        stock: 40
    },

    {
        name: "Produits ménagers",
        stock: 30
    }

]);

let materials = getData("eco_materials", {

    PEHD: 0,
    PP: 0

});


/* =========================================
   3. OUTILS
========================================= */

function $(selector) {

    return document.querySelector(selector);

}


function formatPrice(price) {

    if (price === null || price === undefined) {

        return "Sur devis";

    }

    return Number(price).toLocaleString("fr-FR") + " FCFA";

}


function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (character) {

        const replacements = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        };

        return replacements[character];

    });

}


function saveCart() {

    saveData("eco_cart", cart);

    updateCartCount();

}


function updateCartCount() {

    const count = cart.reduce(function (total, item) {

        return total + item.quantity;

    }, 0);

    document.querySelectorAll(".cart-count").forEach(function (element) {

        element.textContent = count;

    });

}


/* =========================================
   4. AFFICHAGE DES PRODUITS
========================================= */

function productCard(product) {

    return `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.style.display='none'"
                >

            </div>

            <div class="product-info">

                <span class="tag">${escapeHTML(product.category)}</span>

                <h3>${escapeHTML(product.name)}</h3>

                <p>${escapeHTML(product.description)}</p>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <p>
                    Disponibilité :
                    ${product.stock > 0 ? "En stock" : "Rupture de stock"}
                </p>

                <div class="product-actions">

                    <button
                        class="btn orange"
                        onclick="addToCart(${product.id})"
                        ${product.stock <= 0 ? "disabled" : ""}
                    >
                        Ajouter au panier
                    </button>

                    <button
                        class="btn light"
                        onclick="toggleCompare(${product.id})"
                    >
                        Comparer
                    </button>

                </div>

            </div>

        </article>

    `;

}


function renderShop() {

    const container = $("#product-list");

    if (!container) return;

    const search = ($("#search")?.value || "").toLowerCase();

    const category = $("#category")?.value || "";

    const filtered = products.filter(function (product) {

        const matchesSearch =

            product.name.toLowerCase().includes(search) ||

            product.description.toLowerCase().includes(search);

        const matchesCategory =

            !category || product.category === category;

        return matchesSearch && matchesCategory;

    });


    const categories = [

        "Maison",
        "École",
        "Restaurant",
        "Entreprise",
        "Lieu public"

    ];


    container.innerHTML = categories

        .filter(function (name) {

            return !category || name === category;

        })

        .map(function (name) {

            const categoryProducts = filtered.filter(function (product) {

                return product.category === name;

            });

            if (categoryProducts.length === 0) return "";

            return `

                <section>

                    <h2>${name}</h2>

                    <div class="grid">

                        ${categoryProducts.map(productCard).join("")}

                    </div>

                </section>

            `;

        }).join("");


    if (!filtered.length) {

        container.innerHTML = `

            <div class="notice warning">

                Aucun produit ne correspond à votre recherche.

            </div>

        `;

    }

}


/* =========================================
   5. PRODUITS POPULAIRES
========================================= */

function renderPopular() {

    const container = $("#popular-products");

    if (!container) return;

    const popularIds = [1, 4, 7, 10, 13];

    container.innerHTML = popularIds.map(function (id) {

        const product = products.find(function (item) {

            return item.id === id;

        });

        return productCard(product);

    }).join("");

}


/* =========================================
   6. COMPARATEUR
========================================= */

let compareList = [];


function toggleCompare(id) {

    if (compareList.includes(id)) {

        compareList = compareList.filter(function (item) {

            return item !== id;

        });

    } else {

        if (compareList.length >= 3) {

            alert("Vous pouvez comparer au maximum 3 produits.");

            return;

        }

        compareList.push(id);

    }

    renderCompare();

}


function renderCompare() {

    const container = $("#compare-box");

    if (!container) return;

    if (compareList.length === 0) {

        container.innerHTML = "";

        return;

    }

    const selected = products.filter(function (product) {

        return compareList.includes(product.id);

    });


    container.innerHTML = `

        <h2>Comparaison des produits</h2>

        <div class="table-wrap">

            <table>

                <tr>

                    <th>Produit</th>

                    <th>Catégorie</th>

                    <th>Prix</th>

                    <th>Stock</th>

                </tr>

                ${selected.map(function (product) {

                    return `

                        <tr>

                            <td>${escapeHTML(product.name)}</td>

                            <td>${escapeHTML(product.category)}</td>

                            <td>${formatPrice(product.price)}</td>

                            <td>${product.stock}</td>

                        </tr>

                    `;

                }).join("")}

            </table>

        </div>

    `;

}


/* =========================================
   7. AJOUT AU PANIER
========================================= */

function addToCart(id) {

    const product = products.find(function (item) {

        return item.id === id;

    });

    if (!product || product.stock <= 0) {

        alert("Ce produit n'est pas disponible.");

        return;

    }

    const existing = cart.find(function (item) {

        return item.id === id;

    });

    const quantity = existing ? existing.quantity : 0;

    if (quantity >= product.stock) {

        alert("Stock insuffisant.");

        return;

    }

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            quantity: 1

        });

    }

    saveCart();

    alert("Produit ajouté au panier !");

}


/* =========================================
   8. AFFICHAGE DU PANIER
========================================= */

function renderCart() {

    const container = $("#cart-area");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2>Votre panier est vide</h2>

                <p>
                    Vous n'avez pas encore sélectionné de produit.
                </p>

                <a class="btn orange" href="boutique.html">
                    Découvrir la boutique
                </a>

            </div>

        `;

        return;

    }


    let total = 0;

    let hasQuote = false;


    const rows = cart.map(function (item) {

        const product = products.find(function (p) {

            return p.id === item.id;

        });

        if (!product) return "";

        if (product.price === null) {

            hasQuote = true;

        } else {

            total += product.price * item.quantity;

        }

        return `

            <div class="cart-row">

                <div>

                    <h3>${escapeHTML(product.name)}</h3>

                    <p>${formatPrice(product.price)}</p>

                </div>

                <div class="cart-quantity">

                    <button onclick="changeQuantity(${item.id}, -1)">−</button>

                    <strong>${item.quantity}</strong>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                </div>

                <button
                    class="btn light"
                    onclick="removeFromCart(${item.id})"
                >
                    Supprimer
                </button>

            </div>

        `;

    }).join("");


    container.innerHTML = `

        <div class="card">

            <h2>Vos articles</h2>

            ${rows}

            <div class="cart-total">

                <h3>Récapitulatif</h3>

                <p>
                    Total des produits tarifés :
                    <strong>${formatPrice(total)}</strong>
                </p>

                ${hasQuote ? `

                    <p>
                        Certains articles sont sur devis.
                        Leur prix devra être confirmé par EcoDakar.
                    </p>

                ` : ""}

            </div>

        </div>

    `;

}


function changeQuantity(id, change) {

    const item = cart.find(function (product) {

        return product.id === id;

    });

    if (!item) return;

    const product = products.find(function (p) {

        return p.id === id;

    });

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {

        removeFromCart(id);

        return;

    }

    if (newQuantity > product.stock) {

        alert("Stock insuffisant.");

        return;

    }

    item.quantity = newQuantity;

    saveCart();

    renderCart();

}


function removeFromCart(id) {

    cart = cart.filter(function (item) {

        return item.id !== id;

    });

    saveCart();

    renderCart();

}


/* =========================================
   9. VALIDATION DE COMMANDE
========================================= */

function placeOrder() {

    const message = $("#order-message");

    const name = $("#order-name")?.value.trim();

    const phone = $("#order-phone")?.value.trim();

    const address = $("#order-address")?.value.trim();

    const payment = $("#payment")?.value;


    if (!cart.length) {

        message.textContent = "Votre panier est vide.";

        message.className = "notice error";

        return;

    }

    if (!name || !phone || !address) {

        message.textContent = "Veuillez remplir tous les champs obligatoires.";

        message.className = "notice error";

        return;

    }


    const orderItems = [];

    let total = 0;

    let hasQuote = false;


    for (const item of cart) {

        const product = products.find(function (p) {

            return p.id === item.id;

        });

        if (!product || product.stock < item.quantity) {

            message.textContent = "Un produit n'a plus assez de stock.";

            message.className = "notice error";

            return;

        }

        if (product.price === null) {

            hasQuote = true;

        } else {

            total += product.price * item.quantity;

        }

        orderItems.push({

            id: product.id,

            name: product.name,

            quantity: item.quantity,

            price: product.price

        });

    }


    const order = {

        id: "ED-" + Date.now(),

        name: name,

        phone: phone,

        address: address,

        payment: payment,

        items: orderItems,

        total: total,

        hasQuote: hasQuote,

        status: "En attente",

        date: new Date().toLocaleString("fr-FR")

    };


    orders.push(order);

    saveData("eco_orders", orders);


    cart.forEach(function (item) {

        const product = products.find(function (p) {

            return p.id === item.id;

        });

        product.stock -= item.quantity;

    });


    saveData("eco_products", products);


    cart = [];

    saveCart();

    renderCart();


    message.textContent =

        "Votre commande " + order.id +

        " a bien été enregistrée. Merci pour votre confiance !";

    message.className = "notice";

}


/* =========================================
   10. SUIVI DES COMMANDES
========================================= */

function trackOrders() {

    const phone = $("#track-phone")?.value.trim();

    const container = $("#tracking-results");

    if (!phone) {

        container.innerHTML = `

            <p class="notice error">
                Veuillez entrer votre numéro de téléphone.
            </p>

        `;

        return;

    }


    const results = orders.filter(function (order) {

        return order.phone === phone;

    });


    if (!results.length) {

        container.innerHTML = `

            <p class="notice warning">
                Aucune commande trouvée pour ce numéro.
            </p>

        `;

        return;

    }


    container.innerHTML = results.map(function (order) {

        return `

            <div class="order-card">

                <h3>Commande ${escapeHTML(order.id)}</h3>

                <p>Date : ${escapeHTML(order.date)}</p>

                <p>
                    Montant :
                    ${formatPrice(order.total)}
                </p>

                <p>
                    Statut :
                    <span class="status">
                        ${escapeHTML(order.status)}
                    </span>
                </p>

            </div>

        `;

    }).join("");

}


/* =========================================
   11. COMPTE CLIENT
========================================= */

function renderAccount() {

    const container = $("#account-area");

    if (!container) return;

    if (currentUser) {

        container.innerHTML = `

            <div class="card form-card">

                <h2>Bienvenue ${escapeHTML(currentUser.name)}</h2>

                <p>
                    Vous êtes connecté à votre espace client.
                </p>

                <p>
                    Adresse e-mail :
                    ${escapeHTML(currentUser.email)}
                </p>

                <a class="btn orange" href="panier.html">
                    Consulter mes commandes
                </a>

                <button class="btn light" onclick="logout()">
                    Déconnexion
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="card form-card">

            <div class="account-tabs">

                <button
                    class="active"
                    onclick="showAccountForm('register', this)"
                >
                    Créer un compte
                </button>

                <button
                    onclick="showAccountForm('login', this)"
                >
                    Connexion
                </button>

            </div>

            <div id="account-form">

                <h2>Créer un compte</h2>

                <label>Nom complet</label>

                <input
                    id="register-name"
                    placeholder="Votre nom"
                >

                <label>E-mail</label>

                <input
                    id="register-email"
                    type="email"
                    placeholder="Votre adresse e-mail"
                >

                <label>Mot de passe</label>

                <input
                    id="register-password"
                    type="password"
                    placeholder="Choisissez un mot de passe"
                >

                <button
                    class="btn orange"
                    onclick="register()"
                >
                    Créer mon compte
                </button>

                <p id="account-message"></p>

            </div>

        </div>

    `;

}


function showAccountForm(type, button) {

    document.querySelectorAll(".account-tabs button").forEach(function (b) {

        b.classList.remove("active");

    });

    button.classList.add("active");

    const container = $("#account-form");

    if (type === "register") {

        container.innerHTML = `

            <h2>Créer un compte</h2>

            <label>Nom complet</label>

            <input id="register-name" placeholder="Votre nom">

            <label>E-mail</label>

            <input id="register-email" type="email">

            <label>Mot de passe</label>

            <input id="register-password" type="password">

            <button class="btn orange" onclick="register()">
                Créer mon compte
            </button>

            <p id="account-message"></p>

        `;

    } else {

        container.innerHTML = `

            <h2>Connexion</h2>

            <label>E-mail</label>

            <input id="login-email" type="email">

            <label>Mot de passe</label>

            <input id="login-password" type="password">

            <button class="btn orange" onclick="login()">
                Se connecter
            </button>

            <p id="account-message"></p>

        `;

    }

}


function register() {

    const name = $("#register-name")?.value.trim();

    const email = $("#register-email")?.value.trim().toLowerCase();

    const password = $("#register-password")?.value;


    if (!name || !email || !password) {

        alert("Veuillez remplir tous les champs.");

        return;

    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        alert("Adresse e-mail invalide.");

        return;

    }

    if (password.length < 6) {

        alert("Le mot de passe doit contenir au moins 6 caractères.");

        return;

    }

    if (users.some(function (user) {

        return user.email === email;

    })) {

        alert("Cette adresse e-mail est déjà utilisée.");

        return;

    }


    users.push({

        name: name,

        email: email,

        password: password

    });

    saveData("eco_users", users);


    alert("Votre compte a été créé avec succès.");

    renderAccount();

}


function login() {

    const email = $("#login-email")?.value.trim().toLowerCase();

    const password = $("#login-password")?.value;


    const user = users.find(function (item) {

        return item.email === email && item.password === password;

    });


    if (!user) {

        alert("E-mail ou mot de passe incorrect.");

        return;

    }


    currentUser = {

        name: user.name,

        email: user.email

    };

    saveData("eco_current_user", currentUser);

    renderAccount();

}


function logout() {

    currentUser = null;

    saveData("eco_current_user", null);

    renderAccount();

}


/* =========================================
   12. RÉCOMPENSES
========================================= */

function calculateReward() {

    const input = $("#kg-input");

    const result = $("#reward-result");

    if (!input || !result) return;

    const kg = Number(input.value);


    let reward = "Aucun palier atteint.";

    if (kg >= 50) {

        reward = "Palier 50 kg : bon pour un lot de savons.";

    } else if (kg >= 30) {

        reward = "Palier 30 kg : bon pour des produits ménagers ou un sac réutilisable.";

    } else if (kg >= 20) {

        reward = "Palier 20 kg : bon pour des fournitures scolaires.";

    } else if (kg >= 10) {

        reward = "Palier 10 kg : bon pour des produits d'entretien.";

    } else if (kg >= 5) {

        reward = "Palier 5 kg : bon pour un savon.";

    }


    if (kg < 0) {

        reward = "Veuillez saisir un poids positif.";

    }


    result.textContent = reward;

}


/* =========================================
   13. FORMULAIRE DE CONTACT
========================================= */

function sendContact() {

    const name = $("#contact-name")?.value.trim();

    const detail = $("#contact-detail")?.value.trim();

    const message = $("#contact-message")?.value.trim();

    const result = $("#contact-result");


    if (!name || !detail || !message) {

        result.textContent = "Veuillez remplir tous les champs.";

        result.className = "notice error";

        return;

    }


    messages.push({

        name: name,

        contact: detail,

        message: message,

        date: new Date().toLocaleString("fr-FR")

    });


    saveData("eco_messages", messages);


    result.textContent = "Votre message a bien été enregistré.";

    result.className = "notice";


    $("#contact-name").value = "";

    $("#contact-detail").value = "";

    $("#contact-message").value = "";

}


/* =========================================
   14. NEWSLETTER
========================================= */

function subscribe() {

    const email = $("#newsletter-email")?.value.trim().toLowerCase();

    const result = $("#newsletter-result");


    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        result.textContent = "Veuillez saisir une adresse e-mail valide.";

        return;

    }


    if (subscribers.includes(email)) {

        result.textContent = "Cette adresse est déjà inscrite.";

        return;

    }


    subscribers.push(email);

    saveData("eco_subscribers", subscribers);


    result.textContent = "Inscription enregistrée. Merci !";

    $("#newsletter-email").value = "";

}


/* =========================================
   15. GESTION DES STOCKS ET COMMANDES
========================================= */

function renderManagement() {

    const container = $("#management-area");

    if (!container) return;


    container.innerHTML = `

        <section class="management-section">

            <h2>Tableau de bord</h2>

            <div class="grid">

                <div class="stat-card">

                    <h3>${products.length}</h3>

                    <p>Références produits</p>

                </div>

                <div class="stat-card">

                    <h3>${orders.length}</h3>

                    <p>Commandes enregistrées</p>

                </div>

                <div class="stat-card">

                    <h3>${messages.length}</h3>

                    <p>Messages reçus</p>

                </div>

            </div>

        </section>


        <section class="management-section">

            <h2>Gestion des produits</h2>

            <div class="table-wrap">

                <table>

                    <thead>

                        <tr>

                            <th>Produit</th>

                            <th>Catégorie</th>

                            <th>Prix FCFA</th>

                            <th>Stock</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${products.map(function (product) {

                            return `

                                <tr>

                                    <td>${escapeHTML(product.name)}</td>

                                    <td>${escapeHTML(product.category)}</td>

                                    <td>

                                        <input
                                            type="number"
                                            min="0"
                                            id="price-${product.id}"
                                            value="${product.price ?? ""}"
                                            placeholder="Sur devis"
                                        >

                                    </td>

                                    <td>

                                        <input
                                            type="number"
                                            min="0"
                                            id="stock-${product.id}"
                                            value="${product.stock}"
                                        >

                                    </td>

                                    <td>

                                        <button
                                            class="btn orange"
                                            onclick="updateProduct(${product.id})"
                                        >
                                            Enregistrer
                                        </button>

                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </section>


        <section class="management-section">

            <h2>Gestion des matières collectées</h2>

            <div class="card">

                <p>Stock PEHD : <strong>${materials.PEHD} kg</strong></p>

                <p>Stock PP : <strong>${materials.PP} kg</strong></p>

                <label>Type de plastique</label>

                <select id="material-type">

                    <option value="PEHD">PEHD</option>

                    <option value="PP">PP</option>

                </select>

                <label>Poids collecté en kg</label>

                <input
                    id="material-weight"
                    type="number"
                    min="0"
                    placeholder="Exemple : 25"
                >

                <button
                    class="btn orange"
                    onclick="addMaterial()"
                >
                    Enregistrer la collecte
                </button>

            </div>

        </section>


        <section class="management-section">

            <h2>Gestion des récompenses</h2>

            <div class="table-wrap">

                <table>

                    <thead>

                        <tr>

                            <th>Récompense</th>

                            <th>Stock disponible</th>

                            <th>Modification</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rewards.map(function (reward, index) {

                            return `

                                <tr>

                                    <td>${escapeHTML(reward.name)}</td>

                                    <td>${reward.stock}</td>

                                    <td>

                                        <input
                                            id="reward-${index}"
                                            type="number"
                                            min="0"
                                            value="${reward.stock}"
                                        >

                                        <button
                                            class="btn orange"
                                            onclick="changeReward(${index})"
                                        >
                                            Modifier
                                        </button>

                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </section>


        <section class="management-section">

            <h2>Commandes des clients</h2>

            ${orders.length ? orders.map(function (order) {

                return `

                    <div class="order-card">

                        <h3>${escapeHTML(order.id)}</h3>

                        <p>Client : ${escapeHTML(order.name)}</p>

                        <p>Téléphone : ${escapeHTML(order.phone)}</p>

                        <p>Adresse : ${escapeHTML(order.address)}</p>

                        <p>Date : ${escapeHTML(order.date)}</p>

                        <p>Total : ${formatPrice(order.total)}</p>

                        <p>Statut : ${escapeHTML(order.status)}</p>

                        <label>Modifier le statut</label>

                        <select id="status-${escapeHTML(order.id)}">

                            <option ${order.status === "En attente" ? "selected" : ""}>
                                En attente
                            </option>

                            <option ${order.status === "Confirmée" ? "selected" : ""}>
                                Confirmée
                            </option>

                            <option ${order.status === "En préparation" ? "selected" : ""}>
                                En préparation
                            </option>

                            <option ${order.status === "En livraison" ? "selected" : ""}>
                                En livraison
                            </option>

                            <option ${order.status === "Livrée" ? "selected" : ""}>
                                Livrée
                            </option>

                            <option ${order.status === "Annulée" ? "selected" : ""}>
                                Annulée
                            </option>

                        </select>

                        <button
                            class="btn orange"
                            onclick="updateOrder('${escapeHTML(order.id)}')"
                        >
                            Mettre à jour
                        </button>

                    </div>

                `;

            }).join("") : `

                <p class="notice">
                    Aucune commande enregistrée pour le moment.
                </p>

            `}

        </section>


        <section class="management-section">

            <h2>Messages des clients</h2>

            ${messages.length ? messages.map(function (message) {

                return `

                    <div class="order-card">

                        <h3>${escapeHTML(message.name)}</h3>

                        <p>Contact : ${escapeHTML(message.contact)}</p>

                        <p>${escapeHTML(message.message)}</p>

                        <small>${escapeHTML(message.date)}</small>

                    </div>

                `;

            }).join("") : `

                <p class="notice">
                    Aucun message reçu.
                </p>

            `}

        </section>

    `;

}


function updateProduct(id) {

    const product = products.find(function (p) {

        return p.id === id;

    });

    const priceValue = $(`#price-${id}`).value;

    const stockValue = $(`#stock-${id}`).value;


    if (stockValue === "" || Number(stockValue) < 0) {

        alert("Stock invalide.");

        return;

    }


    product.price = priceValue === "" ? null : Number(priceValue);

    product.stock = Number(stockValue);


    saveData("eco_products", products);

    alert("Produit mis à jour.");

    renderManagement();

}


function addMaterial() {

    const type = $("#material-type").value;

    const weight = Number($("#material-weight").value);


    if (!weight || weight <= 0) {

        alert("Veuillez saisir un poids positif.");

        return;

    }


    materials[type] += weight;

    saveData("eco_materials", materials);


    alert("Collecte enregistrée.");

    renderManagement();

}


function changeReward(index) {

    const input = $(`#reward-${index}`);

    const value = Number(input.value);


    if (value < 0 || input.value === "") {

        alert("Stock invalide.");

        return;

    }


    rewards[index].stock = value;

    saveData("eco_rewards", rewards);


    alert("Stock de récompenses mis à jour.");

    renderManagement();

}


function updateOrder(id) {

    const select = $(`#status-${id}`);

    const order = orders.find(function (item) {

        return item.id === id;

    });


    if (!order || !select) return;


    order.status = select.value;

    saveData("eco_orders", orders);


    alert("Statut de la commande mis à jour.");

    renderManagement();

}


/* =========================================
   16. QUIZ DE SENSIBILISATION
========================================= */

const quizQuestions = [

    {

        question: "Quel est l'objectif du tri des déchets ?",

        options: [

            "Mélanger tous les déchets",

            "Faciliter leur valorisation",

            "Jeter les déchets dans les rues"

        ],

        answer: 1

    },

    {

        question: "Quel numéro correspond au PEHD ?",

        options: [

            "N°2",

            "N°5",

            "N°7"

        ],

        answer: 0

    },

    {

        question: "Que faut-il faire avant de déposer un emballage plastique ?",

        options: [

            "Le jeter avec les autres déchets",

            "Le préparer selon les consignes de collecte",

            "Le brûler"

        ],

        answer: 1

    }

];


let quizIndex = 0;


function renderQuiz() {

    const questionContainer = $("#quiz-question");

    const optionsContainer = $("#quiz-options");


    if (!questionContainer || !optionsContainer) return;


    const question = quizQuestions[quizIndex];


    questionContainer.textContent = question.question;


    optionsContainer.innerHTML = question.options.map(function (option, index) {

        return `

            <button
                class="btn light"
                onclick="answerQuiz(${index})"
            >
                ${escapeHTML(option)}
            </button>

        `;

    }).join("");

}


function answerQuiz(index) {

    const question = quizQuestions[quizIndex];

    const feedback = $("#quiz-feedback");


    if (index === question.answer) {

        feedback.textContent = "Bonne réponse ! Bravo.";

        feedback.className = "notice";

    } else {

        feedback.textContent = "Ce n'est pas la bonne réponse. Réessayez.";

        feedback.className = "notice warning";

        return;

    }


    quizIndex++;


    if (quizIndex >= quizQuestions.length) {

        $("#quiz-question").textContent =

            "Félicitations ! Vous avez terminé le quiz EcoDakar.";

        $("#quiz-options").innerHTML = `

            <button
                class="btn orange"
                onclick="restartQuiz()"
            >
                Recommencer le quiz
            </button>

        `;

        return;

    }


    const nextButton = document.createElement("button");

    nextButton.className = "btn orange";

    nextButton.textContent = "Question suivante";

    nextButton.onclick = function () {

        feedback.textContent = "";

        renderQuiz();

        nextButton.remove();

    };

    $("#quiz-options").appendChild(nextButton);

}


function restartQuiz() {

    quizIndex = 0;

    $("#quiz-feedback").textContent = "";

    renderQuiz();

}


/* =========================================
   17. INITIALISATION DU SITE
========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* Récupérer les produits sauvegardés */

    const savedProducts = getData("eco_products", null);

    if (savedProducts) {

        savedProducts.forEach(function (saved) {

            const product = products.find(function (p) {

                return p.id === saved.id;

            });

            if (product) {

                product.price = saved.price;

                product.stock = saved.stock;

            }

        });

    }


    /* Actualiser le panier */

    updateCartCount();


    /* Page boutique */

    if (document.body.dataset.page === "boutique") {

        renderShop();

    }


    /* Page accueil */

    if (document.body.dataset.page === "index") {

        renderPopular();

    }


    /* Page panier */

    if (document.body.dataset.page === "panier") {

        renderCart();

    }


    /* Page compte */

    if (document.body.dataset.page === "compte") {

        renderAccount();

    }


    /* Page gestion */

    if (document.body.dataset.page === "gestion") {

        renderManagement();

    }


    /* Page sensibilisation */

    if (document.body.dataset.page === "sensibilisation") {

        renderQuiz();

    }


    /* Page récompenses */

    if (document.body.dataset.page === "recompenses") {

        calculateReward();

    }

});