'use strict';

// ========================================
// ELEMENTS AND STATE
// ========================================

const search = document.getElementById('search');
const from = document.getElementById('date-from');
const to = document.getElementById('date-to');

const rowsContainer = document.getElementById('order-rows');
const noOrders = document.getElementById('no-orders');
const orderCount = document.getElementById('order-count');
const historyMessage = document.getElementById('history-message');

let orders = [];


// ========================================
// HELPERS
// ========================================

const money = amount =>
  '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function showMessage(message) {
  historyMessage.textContent = message;
  historyMessage.hidden = false;
}

function hideMessage() {
  historyMessage.textContent = '';
  historyMessage.hidden = true;
}

async function getResponseData(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errors = Object.values(data.errors || {}).flat();

    throw new Error(
      errors[0] || data.message || 'Failed to load order history.'
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
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getDateKey(value) {
  if (!value) return '';

  // Laravel timestamps commonly use YYYY-MM-DD HH:mm:ss.
  return String(value).slice(0, 10);
}


// ========================================
// LOAD ORDERS
// GET /api/history
// ========================================

async function loadOrders() {
  rowsContainer.replaceChildren();

  const loadingRow = document.createElement('tr');
  const loadingCell = document.createElement('td');

  loadingCell.colSpan = 8;
  loadingCell.textContent = 'Loading orders...';

  loadingRow.append(loadingCell);
  rowsContainer.append(loadingRow);

  orderCount.textContent = 'Loading orders...';
  hideMessage();

  try {
    const response = await fetch('/api/history', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    orders = data.orders || [];

    renderOrders();
    filterOrders();

  } catch (error) {
    rowsContainer.replaceChildren();

    orderCount.textContent = 'Unable to load orders.';

    showMessage(
      error.message || 'Failed to load order history.'
    );
  }
}


// ========================================
// RENDER ORDER ROWS
// ========================================

function renderOrders() {
  rowsContainer.replaceChildren();

  if (orders.length === 0) {
    noOrders.hidden = false;
    orderCount.textContent = 'Showing 0 of 0 orders';
    return;
  }

  orders.forEach(order => {
    const row = document.createElement('tr');

    row.dataset.date = getDateKey(order.created_at);

    // Order number
    const numberCell = document.createElement('td');
    numberCell.className = 'c-no';
    numberCell.textContent = `#${order.id}`;

    // Date
    const dateCell = document.createElement('td');
    dateCell.className = 'c-date muted';
    dateCell.textContent = formatDate(order.created_at);

    // Customer
    const customerCell = document.createElement('td');
    customerCell.className = 'c-cust';
    customerCell.textContent = order.customer_name || 'Walk-in';

    // Table
    const tableCell = document.createElement('td');
    tableCell.className = 'hide-sm';
    tableCell.textContent = order.table_no || '—';

    // Item count
    const itemsCell = document.createElement('td');
    itemsCell.className = 'hide-sm num';
    itemsCell.textContent = Number(order.items_count || 0);

    // Total
    const totalCell = document.createElement('td');
    totalCell.className = 'c-total num';
    totalCell.textContent = money(order.grandtotal);

    // Payment status
    const statusCell = document.createElement('td');
    statusCell.className = 'c-status';

    const badge = document.createElement('span');
    const status = String(order.payment_status || 'pending').toLowerCase();

    badge.className = `badge ${status}`;
    badge.textContent = status.charAt(0).toUpperCase() + status.slice(1);

    statusCell.append(badge);

    // View bill
    const actionCell = document.createElement('td');
    actionCell.className = 'c-act';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const billLink = document.createElement('a');
    billLink.className = 'btn btn-sm';
    billLink.textContent = 'View bill';

    // Change this path if your billing Blade page uses another URL.
    billLink.href = `/billing?order_id=${encodeURIComponent(order.id)}`;

    actions.append(billLink);
    actionCell.append(actions);

    row.append(
      numberCell,
      dateCell,
      customerCell,
      tableCell,
      itemsCell,
      totalCell,
      statusCell,
      actionCell
    );

    rowsContainer.append(row);
  });
}


// ========================================
// SEARCH AND DATE FILTERS
// ========================================

function filterOrders() {
  const text = search.value.trim().toLowerCase();

  const fromDate = from.value;
  const toDate = to.value;

  let shown = 0;

  rowsContainer.querySelectorAll('tr[data-date]').forEach(row => {
    const date = row.dataset.date;

    const matchesText = row.textContent
      .toLowerCase()
      .includes(text);

    const matchesFrom = !fromDate || date >= fromDate;
    const matchesTo = !toDate || date <= toDate;

    const matches = matchesText && matchesFrom && matchesTo;

    row.hidden = !matches;

    if (matches) {
      shown++;
    }
  });

  noOrders.hidden = shown !== 0;

  orderCount.textContent =
    `Showing ${shown} of ${orders.length} orders`;
}

search.addEventListener('input', filterOrders);
from.addEventListener('change', filterOrders);
to.addEventListener('change', filterOrders);


// ========================================
// INITIAL LOAD
// ========================================

loadOrders();