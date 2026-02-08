document.addEventListener('DOMContentLoaded', () => {
    // 1. Get URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const tableNum = urlParams.get('table') || '01';
    const pref = urlParams.get('pref') || 'all'; // veg, non-veg, all

    // 2. Set Table Number
    const tableDisplay = document.getElementById('table-number');
    if (tableDisplay) tableDisplay.textContent = tableNum.padStart(2, '0');

    const successTable = document.getElementById('success-table');
    if (successTable) successTable.textContent = tableNum.padStart(2, '0');

    // 3. Filter Categories and Items based on Preference
    // Global filter logic

    let activeCategories = categories;
    let activeItems = menuItems;

    if (pref === 'veg') {
        // Show only veg items
        activeItems = menuItems.filter(i => i.type === 'veg' || i.category === 'beverages');
        // Hide 'Non-Veg' category tab
        activeCategories = categories.filter(c => c.id !== 'non-veg');
    } else if (pref === 'non-veg') {
        // Show only active non-veg items OR beverages
        activeItems = menuItems.filter(i => i.type === 'non-veg' || i.category === 'beverages');
        // Hide only 'Veg' category tab
        activeCategories = categories.filter(c => c.id !== 'veg');
    }

    // Store global items for local searching/filtering
    window.globalActiveItems = activeItems;

    // 4. Render with filtered lists
    renderCategories(activeCategories);
    renderItems(activeItems);

    // 5. Setup Listeners
    setupSearch();
    setupThemeSwitcher();
});

// --- State ---
let cart = {}; // Object to store items: { id: { ...item, qty: 1 } }
let currentCategory = 'all';

// --- Rendering Functions ---

function renderCategories(catsToRender) {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;
    categoryList.innerHTML = '';

    // Default to 'categories' if not passed
    const list = catsToRender || categories;

    list.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = `category-pill ${index === 0 ? 'active' : ''}`; // Activate first by default
        btn.textContent = cat.name;
        btn.dataset.id = cat.id;

        btn.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Filter items
            filterItems(cat.id);
        });

        categoryList.appendChild(btn);
    });
}

function renderItems(items) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-color); width: 100%; grid-column: 1/-1; padding: 2rem;">No items found.</p>';
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.style.animationDelay = `${index * 0.05}s`; // Staggered animation

        // Only show badge if NOT a beverage
        const badgeHTML = item.category === 'beverages' ? '' : `
            <span class="item-badge ${item.type === 'veg' ? 'badge-veg' : 'badge-non-veg'}">
                ${item.type === 'veg' ? 'VEG' : 'NON-VEG'}
            </span>
        `;

        card.innerHTML = `
            <div style="position: relative;">
                ${badgeHTML}
                <img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h4 class="item-name">${item.name}</h4>
                </div>
                <p class="item-desc">${item.description}</p>
                <div class="card-footer">
                    <span class="price">₹${item.price}</span>
                    <div class="item-actions" id="actions-${item.id}">
                        ${getItemActionsHTML(item)}
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getItemActionsHTML(item) {
    const qty = cart[item.id] ? cart[item.id].qty : 0;

    if (qty > 0) {
        return `
            <div class="btn-qty-card">
                <button onclick="updateItemQty(${item.id}, -1)">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <span>${qty}</span>
                <button onclick="updateItemQty(${item.id}, 1)">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `;
    } else {
        return `
            <button class="btn-add" onclick="updateItemQty(${item.id}, 1)">
                Add
            </button>
        `;
    }
}

// --- Logic Functions ---

function filterItems(categoryId) {
    currentCategory = categoryId;
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Use the GLOBALLY filtered list (based on preference)
    const baseList = window.globalActiveItems || menuItems;

    // Filter based on both category and search term
    const filtered = baseList.filter(item => {
        const matchesCategory = categoryId === 'all' ||
            (categoryId === 'veg' && item.type === 'veg') ||
            (categoryId === 'non-veg' && item.type === 'non-veg') ||
            item.category === categoryId;

        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderItems(filtered);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        filterItems(currentCategory);
    });
}

// --- Cart Logic ---

function updateItemQty(itemId, change) {
    // Check if item exists in cart, if not find in menu
    if (!cart[itemId]) {
        if (change > 0) {
            const item = menuItems.find(i => i.id === itemId);
            if (item) cart[itemId] = { ...item, qty: 0 };
        } else {
            return; // Cannot decrement if not in cart
        }
    }

    // Update Qty
    cart[itemId].qty += change;

    // Cleanup if 0
    if (cart[itemId].qty <= 0) {
        delete cart[itemId];
    }

    // UI Updates
    updateCartUI();

    // Update specific card UI without re-rendering grid
    const actionContainer = document.getElementById(`actions-${itemId}`);
    if (actionContainer) {
        // Need item object to render HTML
        const item = menuItems.find(i => i.id === itemId);
        actionContainer.innerHTML = getItemActionsHTML(item);
    }

    // Also update modal list if open
    if (document.getElementById('cart-modal').classList.contains('open')) {
        renderCartList();
        if (Object.keys(cart).length === 0) closeCart();
    }
}

// Deprecated addToCart (mapped to updateItemQty for safety)
function addToCart(itemId) {
    updateItemQty(itemId, 1);
}

function updateCartUI() {
    const bar = document.getElementById('cart-bar');
    const totalCountEl = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('cart-total');

    if (!bar || !totalCountEl || !totalPriceEl) return;

    const items = Object.values(cart);
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Show/Hide Floating Bar
    if (totalQty > 0) {
        bar.classList.add('show');
    } else {
        bar.classList.remove('show');
    }

    totalCountEl.textContent = `${totalQty} Item${totalQty !== 1 ? 's' : ''}`;
    totalPriceEl.textContent = `₹${totalPrice}`;
}

// Modal Functions
function openCart() {
    renderCartList();
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.add('open');
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('open');
}

function renderCartList() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;

    const items = Object.values(cart);
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = '<p style="text-align: center; opacity: 0.6;">Your cart is empty.</p>';
    }

    let total = 0;

    items.forEach(item => {
        total += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">₹${item.price * item.qty}</span>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateItemQty(${item.id}, -1)">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="updateItemQty(${item.id}, 1)">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `;
        list.appendChild(itemEl);
    });

    const modalTotal = document.getElementById('modal-total');
    if (modalTotal) modalTotal.textContent = `₹${total}`;
}

// changeQty removed - unified with updateItemQty

function placeOrder() {
    // Mock Order Placement
    const btn = document.querySelector('.place-order-btn');
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
        // Success
        cart = {}; // Clear cart
        updateCartUI();
        closeCart();

        // Show Success Overlay
        const overlay = document.getElementById('success-overlay');
        if (overlay) overlay.classList.add('show');

        // Reset Button
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

function closeSuccess() {
    const overlay = document.getElementById('success-overlay');
    if (overlay) overlay.classList.remove('show');
}

// --- Theme Switcher ---

function setupThemeSwitcher() {
    const btn = document.getElementById('theme-btn');
    const menu = document.getElementById('theme-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
}

function setTheme(themeName) {
    if (themeName === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    // Close menu
    const menu = document.getElementById('theme-menu');
    if (menu) menu.classList.remove('show');

    // Optional: Save preference
    localStorage.setItem('qr-menu-theme', themeName);
}

// Check saved theme
const savedTheme = localStorage.getItem('qr-menu-theme');
if (savedTheme) {
    setTheme(savedTheme);
}
