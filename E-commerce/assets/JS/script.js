document.addEventListener("DOMContentLoaded", () => {
    const defaultProducts = [
        { 
            id: 1, 
            name: "Laptop", 
            price: 55000, 
            discountPrice: 49999, 
            stock: 15,
            rating: "⭐⭐⭐⭐⭐ (4.5)",
            saleEndTime: "2025-09-30T23:59:59",
            description: "High performance laptop for gaming and work.",
            imageUrl: "https://www.servershyderabad.in/upload/big/dell-g15-gaming-laptop-16gb-13th-gen-intel-core-i5-13450hx.webp" 
        },
        { 
            id: 2, 
            name: "Headphones", 
            price: 2000, 
            discountPrice: 1599, 
            stock: 50,
            rating: "⭐⭐⭐⭐ (4.2)",
            saleEndTime: "2025-09-28T23:59:59",
            description: "Noise cancelling headphones with deep bass.",
            imageUrl: "https://promotionalwears.com/image/cache/catalog/data/JBL/headphones/jblt760nc-min-500x500.webp" 
        },
        { 
            id: 3, 
            name: "Smartphone", 
            price: 28000, 
            discountPrice: 24999, 
            stock: 30,
            rating: "⭐⭐⭐⭐⭐ (4.7)",
            saleEndTime: "2025-10-05T23:59:59",
            description: "Latest smartphone with best-in-class camera.",
            imageUrl: "https://5.imimg.com/data5/SELLER/Default/2024/4/414543291/YS/TK/QB/4480685/imresizer-1714396452098-500x500.jpg" 
        },
        { 
            id: 4, 
            name: "Smartwatch", 
            price: 8000, 
            discountPrice: 6999, 
            stock: 20,
            rating: "⭐⭐⭐⭐ (4.0)",
            saleEndTime: "2025-10-10T23:59:59",
            description: "Fitness smartwatch with heart rate monitor.",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuBoBXxoN2X7lBmaRRXekqhzWsvfrqEc5Nyw&s" 
        }
    ];

    const productCards = document.getElementById("productCards");
    const productForm = document.getElementById("productForm");
    const cartTableBody = document.querySelector("#cartTable tbody");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCart");
    const productDetailsDiv = document.getElementById("productDetails");
    const productTableBody = document.querySelector("#productTable tbody");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let customProducts = JSON.parse(localStorage.getItem("customProducts")) || [];
    let editIndex = null;

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function renderCart() {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const subtotal = (item.discountPrice || item.price) * item.quantity;
            total += subtotal;

            cartTableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${item.imageUrl}" width="60" class="rounded shadow"></td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.discountPrice}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                    </td>
                    <td>₹${subtotal}</td>
                    <td>${item.saleEndTime ? new Date(item.saleEndTime).toLocaleString() : "-"}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
        });

        if (cartTotal) {
            cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
        }

        saveCart();
    }

    window.addToCart = function (id, isCustom = false) {
        const source = isCustom ? customProducts : defaultProducts;
        const product = source.find(p => p.id === id);
        if (!product) return;

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        renderCart();
        if (!isCustom) alert(`${product.name} added to cart!`);
    };

    window.updateQuantity = function (index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        renderCart();
    };

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        renderCart();
    };

    function saveCustomProducts() {
        localStorage.setItem("customProducts", JSON.stringify(customProducts));
    }

    function renderProductTable() {
        if (!productTableBody) return;
        productTableBody.innerHTML = "";
        let total = 0;

        customProducts.forEach((product, index) => {
            const subtotal = product.discountPrice * product.stock;
            total += subtotal;

            productTableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${product.imageUrl}" width="60" class="rounded shadow"></td>
                    <td>${product.name}</td>
                    <td>₹${product.price}</td>
                    <td>₹${product.discountPrice}</td>
                    <td>${product.stock}</td>
                    <td>${product.saleEndTime ? new Date(product.saleEndTime).toLocaleString() : "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick="editProduct(${index})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="removeProduct(${index})">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
        });

        productTableBody.innerHTML += `
            <tr class="table-dark">
                <td colspan="5" class="text-end fw-bold">Total Value</td>
                <td colspan="3" class="fw-bold text-success">₹${total.toLocaleString("en-IN")}</td>
            </tr>
        `;

        saveCustomProducts();
    }

    window.editProduct = function (index) {
        const item = customProducts[index];
        editIndex = index;

        document.getElementById("name").value = item.name;
        document.getElementById("price").value = item.price;
        document.getElementById("discountPrice").value = item.discountPrice;
        document.getElementById("stock").value = item.stock;
        document.getElementById("imageUrl").value = item.imageUrl;
        document.getElementById("description").value = item.description;
        document.getElementById("saleEndTime").value = item.saleEndTime || "";

        productForm.scrollIntoView({ behavior: "smooth" });
    };

    window.removeProduct = function (index) {
        const removed = customProducts.splice(index, 1)[0];
        cart = cart.filter(item => item.id !== removed.id);
        renderProductTable();
        renderCart();
        displayProducts();
    };

    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = Date.now();
            const name = document.getElementById("name").value.trim();
            const price = parseFloat(document.getElementById("price").value);
            const discountPrice = parseFloat(document.getElementById("discountPrice").value) || price;
            const stock = parseInt(document.getElementById("stock").value) || 1;
            const imageUrl = document.getElementById("imageUrl").value.trim();
            const description = document.getElementById("description").value.trim();
            const saleEndTime = document.getElementById("saleEndTime").value;
            const rating = "⭐⭐⭐ (3.0)";

            if (!name || isNaN(price) || !imageUrl || !description) {
                alert("⚠️ Please fill all fields before submitting.");
                return;
            }

            const newProduct = { id, name, price, discountPrice, stock, imageUrl, description, saleEndTime, rating };

            if (editIndex !== null) {
                customProducts[editIndex] = newProduct;
                editIndex = null;
            } else {
                customProducts.push(newProduct);
                addToCart(id, true);
            }

            renderProductTable();
            displayProducts();
            productForm.reset();
        });
    }

    function displayProducts() {
        if (!productCards) return;
        productCards.innerHTML = "";

        [...defaultProducts, ...customProducts].forEach(product => {
            const isCustom = customProducts.find(p => p.id === product.id) ? true : false;

            productCards.innerHTML += `
                <div class="col-md-3">
                    <div class="card h-100 text-center shadow-sm">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="text-warning">${product.rating}</p>
                            <p class="card-text fw-bold">
                                <span class="text-decoration-line-through text-muted">₹${product.price}</span> 
                                <span class="text-success">₹${product.discountPrice}</span>
                            </p>
                            <button class="btn btn-primary me-2" onclick="addToCart(${product.id}, ${isCustom})">
                                <i class="bi bi-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-info" onclick="viewProduct(${product.id}, ${isCustom})">
                                View Product
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    window.viewProduct = function (id, isCustom = false) {
        const source = isCustom ? customProducts : defaultProducts;
        const product = source.find(p => p.id === id);
        if (product) {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-details.html";
        }
    };

    function renderProductDetails() {
        if (!productDetailsDiv) return;
        const product = JSON.parse(localStorage.getItem("selectedProduct"));
        if (product) {
            productDetailsDiv.innerHTML = `
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center">
                        <img src="${product.imageUrl}" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-6">
                        <h2>${product.name}</h2>
                        <p class="text-warning fs-5">${product.rating}</p>
                        <p>
                            <span class="text-decoration-line-through text-muted">₹${product.price}</span>
                            <span class="fs-4 text-success fw-bold">₹${product.discountPrice}</span>
                        </p>
                        <p>${product.description}</p>
                        <p><b>Stock:</b> ${product.stock}</p>
                        <p><b>Sale ends:</b> ${product.saleEndTime ? new Date(product.saleEndTime).toLocaleString() : "-"}</p>
                        <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id}, ${customProducts.find(p=>p.id===product.id) ? true : false})">
                            <i class="bi bi-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }
    }

    displayProducts();
    renderCart();
    renderProductTable();
    renderProductDetails();

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
        });
    }

});
