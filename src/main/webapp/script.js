// Mock Data
const categories = [
    { name: "Vegetables & Fruits", icon: "🥦" },
    { name: "Dairy & Breakfast", icon: "🥛" },
    { name: "Munchies", icon: "🍟" },
    { name: "Cold Drinks", icon: "🥤" },
    { name: "Instant Food", icon: "🍜" },
    { name: "Tea & Coffee", icon: "☕" },
    { name: "Bakery", icon: "🍞" },
    { name: "Sweet Tooth", icon: "🍫" },
    { name: "Baby Care", icon: "👶" },
    { name: "Cleaning", icon: "🧹" },
];

const products = [
    { id: 1, name: "Amul Taaza Toned Fresh Milk", weight: "500 ml", price: 27, icon: "🥛", category: "Dairy & Breakfast" },
    { id: 2, name: "Mother Dairy Full Cream Milk", weight: "500 ml", price: 34, icon: "🥛", category: "Dairy & Breakfast" },
    { id: 3, name: "Lay's India's Magic Masala Chips", weight: "50 g", price: 20, icon: "🥔", category: "Munchies" },
    { id: 4, name: "Coca-Cola Soft Drink", weight: "750 ml", price: 40, icon: "🥤", category: "Cold Drinks" },
    { id: 5, name: "Maggi 2-Minute Masala Noodles", weight: "70 g", price: 14, icon: "🍜", category: "Instant Food" },
    { id: 6, name: "Brown Bread", weight: "400 g", price: 45, icon: "🍞", category: "Bakery" },
    { id: 7, name: "Farm Fresh Tomato", weight: "1 kg", price: 34, icon: "🍅", category: "Vegetables & Fruits" },
    { id: 8, name: "Onion", weight: "1 kg", price: 55, icon: "🧅", category: "Vegetables & Fruits" },
    { id: 9, name: "Britannia Little Hearts", weight: "75 g", price: 25, icon: "🍪", category: "Munchies" },
    { id: 10, name: "Sprite Lime", weight: "750 ml", price: 40, icon: "🥤", category: "Cold Drinks" },
];

const cart = {}; // { itemId: quantity }

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProductRows();
    updateCartUI();
});

function renderCategories() {
    const grid = document.getElementById('category-grid');
    if(!grid) return;
    grid.innerHTML = categories.map(cat => `
        <div class="cat-item">
            <div class="cat-img">${cat.icon}</div>
            <div class="cat-name">${cat.name}</div>
        </div>
    `).join('');
}

function renderProductRows() {
    const container = document.getElementById('product-feeds');
    if(!container) return;
    
    // Group by category for demo
    // We'll just take the categories that have products
    const uniqueCats = [...new Set(products.map(p => p.category))];
    
    container.innerHTML = uniqueCats.map(catName => {
        const catProducts = products.filter(p => p.category === catName);
        const cardsHtml = catProducts.map(p => createProductCard(p)).join('');
        
        return `
        <section class="product-row">
            <div class="row-header">
                <h3>${catName}</h3>
                <button class="add-btn" style="border:none; color: var(--primary-green);">See all</button>
            </div>
            <div class="scroll-container">
                ${cardsHtml}
            </div>
        </section>
        `;
    }).join('');
}

function createProductCard(product) {
    const qty = cart[product.id] || 0;
    const btnHtml = qty === 0 
        ? `<button class="add-btn" onclick="addToCart(${product.id})">ADD</button>`
        : `<div class="qty-control">
             <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
             <span>${qty}</span>
             <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
           </div>`;

    return `
    <div class="product-card" id="product-${product.id}">
        <div class="p-img">${product.icon}</div>
        <div class="time-tag">⏱️ 8 MINS</div>
        <div class="p-name">${product.name}</div>
        <div class="p-weight">${product.weight}</div>
        <div class="p-footer">
            <div class="p-price">₹${product.price}</div>
            <div id="btn-container-${product.id}">
                ${btnHtml}
            </div>
        </div>
    </div>
    `;
}

// Cart Logic
window.addToCart = (id) => {
    cart[id] = 1;
    refreshProductBtn(id);
    updateCartUI();
    // Open cart on first add
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('open')) {
        toggleCart();
    }
};

window.updateQty = (id, change) => {
    if (!cart[id]) return;
    cart[id] += change;
    if (cart[id] <= 0) {
        delete cart[id];
    }
    refreshProductBtn(id);
    updateCartUI();
};

function refreshProductBtn(id) {
    const container = document.getElementById(`btn-container-${id}`);
    const product = products.find(p => p.id === id);
    if (container && product) {
        // Re-generate just the button HTML
        const qty = cart[id] || 0;
        const btnHtml = qty === 0 
        ? `<button class="add-btn" onclick="addToCart(${product.id})">ADD</button>`
        : `<div class="qty-control">
             <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
             <span>${qty}</span>
             <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
           </div>`;
        container.innerHTML = btnHtml;
    }
}

window.toggleCart = () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    if (!sidebar || !overlay) return;
    
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    } else {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
};

function updateCartUI() {
    // Header count
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0); 
    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) {
        if (totalItems > 0) {
            headerCount.innerText = `${totalItems} items`;
            headerCount.classList.remove('hidden');
        } else {
            headerCount.classList.add('hidden');
        }
    }

    // Sidebar items
    const cartContainer = document.getElementById('cart-items-container');
    const cartFooter = document.getElementById('cart-footer');
    
    if(!cartContainer || !cartFooter) return;

    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <div style="font-size:40px;">🛒</div>
                <p>You don't have any items in your cart</p>
                <button class="start-shopping-btn" onclick="toggleCart()" style="padding:10px; background:var(--primary-green); color:#fff; border:none; border-radius:4px; font-weight:700; cursor:pointer;">Start Shopping</button>
            </div>`;
        cartFooter.classList.add('hidden');
        // Reset bills logic?
        return;
    }

    // Render items
    let totalBill = 0;
    const itemsHtml = Object.entries(cart).map(([idStr, qty]) => {
        const id = parseInt(idStr);
        const p = products.find(x => x.id === id);
        if (!p) return '';
        const itemTotal = p.price * qty;
        totalBill += itemTotal;
        return `
        <div class="cart-item">
            <div class="ci-img">${p.icon}</div>
            <div class="ci-details">
                <div class="ci-name">${p.name}</div>
                <div class="ci-price">₹${p.price} x ${qty} = ₹${itemTotal}</div>
                <div class="qty-control" style="width: fit-content; margin-top: 5px;">
                    <button class="qty-btn" onclick="updateQty(${id}, -1)">-</button>
                    <span>${qty}</span>
                    <button class="qty-btn" onclick="updateQty(${id}, 1)">+</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    cartContainer.innerHTML = itemsHtml;
    cartFooter.classList.remove('hidden');
    
    // Bill details
    const bit = document.getElementById('bill-item-total');
    const bgt = document.getElementById('bill-grand-total');
    const btnT = document.getElementById('btn-total');
    if(bit) bit.innerText = `₹${totalBill}`;
    if(bgt) bgt.innerText = `₹${totalBill}`;
    if(btnT) btnT.innerText = `₹${totalBill}`;
}
