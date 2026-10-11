'use strict';

// ========================================
// ELEMENTS
// ========================================

const orderSelect = document.getElementById('order-select');
const viewBillButton = document.getElementById('view-bill');
const printButton = document.getElementById('print');

const receipt = document.getElementById('receipt');
const billRows = document.getElementById('bill-rows');
const billingMessage = document.getElementById('billing-message');

let orders = [];
let currentOrder = null;


// ========================================
// HELPERS
// ========================================

const money = amount =>
  '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function setText(id, value) {
  document.getElementById(id).textContent = value ?? '—';
}

function showMessage(message, type = 'error') {
  billingMessage.textContent = message;
  billingMessage.className = `billing-message ${type}`;
  billingMessage.hidden = false;
}

function hideMessage() {
  billingMessage.textContent = '';
  billingMessage.hidden = true;
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

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}


// ========================================
// LOAD ORDERS
// GET /api/billing
// ========================================

async function loadOrders() {
  orderSelect.replaceChildren(
    new Option('Loading orders...', '')
  );

  orderSelect.disabled = true;
  viewBillButton.disabled = true;
  printButton.disabled = true;

  try {
    const response = await fetch('/api/billing', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    orders = data.orders || [];

    orderSelect.replaceChildren();

    if (orders.length === 0) {
      orderSelect.add(
        new Option('No orders found', '')
      );

      showMessage('No orders are available for billing.');
      return;
    }

    orderSelect.add(
      new Option('Select an order', '')
    );

    orders.forEach(order => {
      orderSelect.add(
        new Option(
          `#${order.id}, ${order.table_no}`,
          String(order.id)
        )
      );
    });

    orderSelect.disabled = false;

    // Load selected order from the URL if supplied.
    const requestedId = new URLSearchParams(
      window.location.search
    ).get('order_id');

    const matchingOrder = orders.find(
      order => String(order.id) === String(requestedId)
    );

    const selectedOrder = matchingOrder || orders[0];

    orderSelect.value = String(selectedOrder.id);

    await loadReceipt(selectedOrder.id);

  } catch (error) {
    orderSelect.replaceChildren(
      new Option('Unable to load orders', '')
    );

    showMessage(error.message || 'Failed to load orders.');

  } finally {
    orderSelect.disabled = orders.length === 0;
  }
}


// ========================================
// LOAD RECEIPT
// GET /api/billing/{id}/receipt
// ========================================

async function loadReceipt(orderId) {
  if (!orderId) {
    showMessage('Please select an order.');
    return;
  }

  hideMessage();

  viewBillButton.disabled = true;
  printButton.disabled = true;

  try {
    const response = await fetch(
      `/api/billing/${encodeURIComponent(orderId)}/receipt`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const data = await getResponseData(response);

    currentOrder = data.order;

    if (!currentOrder) {
      throw new Error('Order details were not returned.');
    }

    renderReceipt(currentOrder);
    printButton.disabled = false;

  } catch (error) {
    currentOrder = null;
    billRows.replaceChildren();

    showMessage(
      error.message || 'Failed to load receipt.'
    );

  } finally {
    viewBillButton.disabled = false;
  }
}


// ========================================
// RENDER RECEIPT
// ========================================

function renderReceipt(order) {
  const orderDate = formatDate(order.created_at);

  // Order details
  setText('order-number', `#${order.id}`);
  setText('order-date', orderDate);
  setText('order-customer', order.customer_name);
  setText('order-table', order.table_no);

  // Payment status badge
  const paymentStatus = document.getElementById(
    'order-payment-status'
  );

  paymentStatus.replaceChildren();

  const badge = document.createElement('span');
  badge.className = `badge ${String(order.payment_status).toLowerCase()}`;
  badge.textContent = order.payment_status;

  paymentStatus.append(badge);

  setText(
    'order-payment-method',
    String(order.payment_method || '—').toUpperCase()
  );

  // Receipt metadata
  setText('receipt-order-number', `#${order.id}`);
  setText('receipt-date', orderDate);
  setText('receipt-table', order.table_no);
  setText('receipt-customer', order.customer_name);

  // Receipt item rows
  billRows.replaceChildren();

  let count = 0;

  (order.items || []).forEach(item => {
    const row = document.createElement('tr');

    const quantity = Number(item.quantity);
    const price = Number(item.unit_price);
    const amount = Number(item.total_price);

    const nameCell = document.createElement('td');
    nameCell.textContent =
      item.menu_item?.name || 'Deleted menu item';

    const qtyCell = document.createElement('td');
    qtyCell.className = 'num';
    qtyCell.textContent = quantity;

    const priceCell = document.createElement('td');
    priceCell.className = 'num';
    priceCell.textContent = Number(price).toFixed(2);

    const amountCell = document.createElement('td');
    amountCell.className = 'num amount';
    amountCell.textContent = Number(amount).toFixed(2);

    row.append(
      nameCell,
      qtyCell,
      priceCell,
      amountCell
    );

    billRows.append(row);

    count += quantity;
  });

  // Use totals saved in the orders table.
  setText('bill-count', count);
  setText('bill-subtotal', money(order.subtotal));
  setText('bill-tax', money(order.tax));
  setText('bill-total', money(order.grandtotal));

  const footer = order.payment_status === 'paid'
    ? `Paid by ${String(order.payment_method).toUpperCase()} — Thank you. Visit again.`
    : 'Payment pending — Thank you.';

  setText('receipt-footer', footer);
}


// ========================================
// VIEW BILL BUTTON
// ========================================

viewBillButton.addEventListener('click', () => {
  loadReceipt(orderSelect.value);
});


orderSelect.addEventListener('change', () => {
  const orderId = orderSelect.value;

  if (orderId) {
    loadReceipt(orderId);
  } else {
    currentOrder = null;
    printButton.disabled = true;
    billRows.replaceChildren();
  }
});


// ========================================
// VIEW BILL BUTTON
// ========================================

viewBillButton.addEventListener('click', () => {
  loadReceipt(orderSelect.value);
});


// ========================================
// PRINT RECEIPT
// ========================================

printButton.addEventListener('click', () => {
  if (currentOrder) {
    window.print();
  }
});


printButton.addEventListener('click', () => {
  if (currentOrder) {
    window.print();
  }
});


loadOrders();