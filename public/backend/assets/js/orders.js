'use strict';

// ========================================
// ELEMENTS AND STATE
// ========================================

const cart = {};

const items = document.getElementById('items');
const categoriesElement = document.getElementById('categories');

const list = document.getElementById('cart-list');
const rowTemplate = document.getElementById('cart-row');

const orderPanel = document.getElementById('order-panel');
const placeOrderButton = document.getElementById('place-order');

const cartEmpty = document.getElementById('cart-empty');
const itemsMessage = document.getElementById('items-message');
const orderMessage = document.getElementById('order-message');

const taxRate = Number(
  document.getElementById('totals').dataset.taxRate
);

let menuItems = [];
let categories = [];


// ========================================
// HELPERS
// ========================================

const money = amount =>
  '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function showMessage(element, message, type = 'error') {
  element.textContent = message;
  element.className = `order-message ${type}`;
  element.hidden = false;
}

function hideMessage(element) {
  element.textContent = '';
  element.hidden = true;
}

async function getResponseData(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errors = Object.values(data.errors || {}).flat();

    throw new Error(
      errors[0] || data.message || 'Something went wrong.'
    );
  }

  return data;
}


// ========================================
// FETCH MENU DATA
// GET /api/order
// ========================================

async function loadOrderData() {
  items.replaceChildren();
  items.textContent = 'Loading menu items...';

  hideMessage(itemsMessage);

  try {
    const response = await fetch('/api/order', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    menuItems = data.items || [];
    categories = data.categories || [];

    renderCategories();
    renderItems();

  } catch (error) {
    items.replaceChildren();

    showMessage(
      itemsMessage,
      error.message || 'Unable to load menu items.'
    );
  }
}


// ========================================
// RENDER CATEGORY CHIPS
// ========================================

function renderCategories() {
  categoriesElement.replaceChildren();

  addCategoryChip('All', '');

  categories.forEach(category => {
    addCategoryChip(category.name, String(category.id));
  });
}

function addCategoryChip(name, categoryId) {
  const label = document.createElement('label');

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'category';
  radio.value = categoryId;
  radio.checked = categoryId === '';

  const span = document.createElement('span');
  span.textContent = name;

  label.append(radio, span);
  categoriesElement.append(label);
}


// ========================================
// RENDER MENU ITEMS
// ========================================

function renderItems() {
  items.replaceChildren();

  if (menuItems.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No menu items found.';
    items.append(message);
    return;
  }

  menuItems.forEach(item => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'item';

    button.dataset.id = item.id;
    button.dataset.category = String(item.category_id);
    button.dataset.price = Number(item.price);

    const available = Number(item.is_available) === 1;

    button.disabled = !available;

    const name = document.createElement('span');
    name.className = 'item-name';
    name.textContent = item.name;

    const price = document.createElement('span');
    price.className = 'item-price';
    price.textContent = available
      ? money(item.price)
      : 'Unavailable';

    button.append(name, price);
    items.append(button);
  });

  filterItems();
}


// ========================================
// CATEGORY FILTER
// ========================================

categoriesElement.addEventListener('change', event => {
  if (event.target.name !== 'category') {
    return;
  }

  filterItems();
});

function filterItems() {
  const selectedRadio = categoriesElement.querySelector(
    'input[name="category"]:checked'
  );

  const selectedCategory = selectedRadio
    ? selectedRadio.value
    : '';

  items.querySelectorAll('.item').forEach(button => {
    button.hidden =
      selectedCategory !== '' &&
      button.dataset.category !== selectedCategory;
  });
}


// ========================================
// ADD ITEM TO CART
// ========================================

items.addEventListener('click', event => {
  const button = event.target.closest('.item');

  if (!button || button.disabled) {
    return;
  }

  const id = button.dataset.id;

  if (!cart[id]) {
    const item = menuItems.find(
      menuItem => String(menuItem.id) === String(id)
    );

    if (!item || Number(item.is_available) !== 1) {
      return;
    }

    cart[id] = {
      name: item.name,
      price: Number(item.price),
      qty: 0
    };
  }

  changeQty(id, 1);

  hideMessage(orderMessage);
});


// ========================================
// CHANGE ITEM QUANTITY
// ========================================

function changeQty(id, step) {
  if (!cart[id]) {
    return;
  }

  cart[id].qty += step;

  if (cart[id].qty < 1) {
    delete cart[id];
  }

  renderCart();
}


// ========================================
// CART PLUS / MINUS BUTTONS
// ========================================

list.addEventListener('click', event => {
  const button = event.target.closest('button[data-step]');

  if (!button) {
    return;
  }

  const row = button.closest('li');
  const id = row.dataset.id;
  const step = Number(button.dataset.step);

  changeQty(id, step);
});


// ========================================
// RENDER CART AND CALCULATE TOTALS
// ========================================

function renderCart() {
  let subtotal = 0;
  let count = 0;

  list.replaceChildren();

  for (const id in cart) {
    const { name, price, qty } = cart[id];

    const row = rowTemplate.content.cloneNode(true);
    const li = row.querySelector('li');

    li.dataset.id = id;

    row.querySelector('.cart-name').textContent = name;
    row.querySelector('.cart-price').textContent =
      `${money(price)} each`;

    row.querySelector('.qty').textContent = qty;

    row.querySelector('.cart-amount').textContent =
      money(price * qty);

    const input = row.querySelector('input');

    input.name = `items[${id}]`;
    input.value = qty;

    list.append(row);

    subtotal += price * qty;
    count += qty;
  }

  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax;

  setText('subtotal', money(subtotal));
  setText('tax', money(tax));
  setText('total', money(total));

  setText(
    'bar-count',
    `${count} ${count === 1 ? 'item' : 'items'}`
  );

  setText('bar-total', money(total));

  placeOrderButton.disabled = count === 0;
  cartEmpty.hidden = count !== 0;

  // Quantity bubble on menu item buttons
  items.querySelectorAll('.item').forEach(button => {
    const id = button.dataset.id;

    if (cart[id]) {
      button.dataset.qty = cart[id].qty;
    } else {
      delete button.dataset.qty;
    }
  });
}


// ========================================
// CLEAR CART
// ========================================

orderPanel.addEventListener('reset', () => {
  Object.keys(cart).forEach(id => {
    delete cart[id];
  });

  renderCart();
  hideMessage(orderMessage);
});


// ========================================
// PLACE ORDER
// ========================================

// ========================================
// PLACE ORDER
// POST /api/order
// ========================================

orderPanel.addEventListener('submit', async event => {
  event.preventDefault();

  if (Object.keys(cart).length === 0) {
    showMessage(orderMessage, 'Please add at least one item.');
    return;
  }

  const formData = new FormData(orderPanel);

  const subtotal = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax;

  const payload = {
    customer_name: formData.get('customer_name').trim() || 'Walk-in',
    table_no: formData.get('table_no'),
    payment_status: formData.get('payment_status'),
    payment_method: formData.get('payment_method'),

    items: Object.entries(cart).map(([id, item]) => ({
      menu_item_id: Number(id),
      quantity: item.qty,
      price: item.price
    })),

    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  };

  hideMessage(orderMessage);

  placeOrderButton.disabled = true;
  placeOrderButton.textContent = 'Placing order...';

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await getResponseData(response);

    // Clear cart only after the backend confirms success.
    Object.keys(cart).forEach(id => delete cart[id]);

    orderPanel.reset();
    renderCart();

    showMessage(
      orderMessage,
      data.message || 'Order placed successfully.',
      'success'
    );

    // Optional order ID if your controller returns it.
    if (data.order?.id) {
      showMessage(
        orderMessage,
        `Order #${data.order.id} placed successfully.`,
        'success'
      );
    }

  } catch (error) {
    showMessage(
      orderMessage,
      error.message || 'Failed to place order.'
    );

  } finally {
    placeOrderButton.textContent = 'Place order';
    placeOrderButton.disabled = Object.keys(cart).length === 0;
  }
});


// ========================================
// INITIAL LOAD
// ========================================

renderCart();
loadOrderData();