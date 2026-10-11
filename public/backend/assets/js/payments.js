
'use strict';

// ========================================
// ELEMENTS AND STATE
// ========================================

const tbody = document.getElementById('payment-rows');
const filter = document.getElementById('status-filter');
const noPayments = document.getElementById('no-payments');
const paymentMessage = document.getElementById('payment-message');

let orders = [];


// ========================================
// HELPERS
// ========================================

const money = amount =>
  '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function showMessage(message, type = 'error') {
  paymentMessage.textContent = message;
  paymentMessage.className = `payment-message ${type}`;
  paymentMessage.hidden = false;
}

function hideMessage() {
  paymentMessage.textContent = '';
  paymentMessage.hidden = true;
}

async function getResponseData(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.status === false) {
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

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}


// ========================================
// FETCH PAYMENTS
// GET /api/payments
// ========================================

async function loadPayments() {
  hideMessage();
  tbody.replaceChildren();

  const loadingRow = document.createElement('tr');
  const loadingCell = document.createElement('td');

  loadingCell.colSpan = 7;
  loadingCell.textContent = 'Loading payments...';

  loadingRow.append(loadingCell);
  tbody.append(loadingRow);

  try {
    const response = await fetch('/api/payments', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    orders = data.orders || [];

    renderPayments();
    updateSummary();
    updateFilter();

  } catch (error) {
    orders = [];
    tbody.replaceChildren();

    updateSummary();
    noPayments.hidden = false;

    showMessage(error.message || 'Unable to load payments.');
  }
}


// ========================================
// RENDER ORDERS
// ========================================

function renderPayments() {
  tbody.replaceChildren();

  orders.forEach(order => {
    const row = document.createElement('tr');

    const status = String(order.payment_status || 'pending')
      .toLowerCase();

    row.dataset.id = order.id;
    row.dataset.status = status;
    row.dataset.amount = Number(order.grandtotal || 0);

    const numberCell = document.createElement('td');
    numberCell.className = 'c-no';
    numberCell.textContent = `#${order.id}`;

    const dateCell = document.createElement('td');
    dateCell.className = 'hide-sm muted';
    dateCell.textContent = formatDate(order.created_at);

    const customerCell = document.createElement('td');
    customerCell.className = 'c-cust';
    customerCell.textContent = order.customer_name || 'Walk-in';

    const amountCell = document.createElement('td');
    amountCell.className = 'c-amount num';
    amountCell.textContent = money(order.grandtotal);

    const methodCell = document.createElement('td');
    methodCell.className = 'c-method';
    methodCell.textContent =
      String(order.payment_method || '—').toUpperCase();

    const statusCell = document.createElement('td');
    statusCell.className = 'c-status';

    const badge = document.createElement('span');
    badge.className = `badge ${status}`;
    badge.textContent =
      status.charAt(0).toUpperCase() + status.slice(1);

    statusCell.append(badge);

    const actionCell = document.createElement('td');
    actionCell.className = 'c-act';

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (status === 'pending') {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'btn btn-sm btn-primary mark-paid';
      button.dataset.id = order.id;
      button.textContent = 'Mark paid';

      actions.append(button);
    }

    const billLink = document.createElement('a');
    billLink.className = 'btn btn-sm';
    billLink.textContent = 'View bill';
    billLink.href =`/billing?order_id=${encodeURIComponent(order.id)}`;

    actions.append(billLink);
    actionCell.append(actions);

    row.append(
      numberCell,
      dateCell,
      customerCell,
      amountCell,
      methodCell,
      statusCell,
      actionCell
    );

    tbody.append(row);
  });
}


// ========================================
// UPDATE REVENUE SUMMARY
// ========================================

function updateSummary() {
  let paidTotal = 0;
  let pendingTotal = 0;
  let paidCount = 0;
  let pendingCount = 0;

  orders.forEach(order => {
    const amount = Number(order.grandtotal || 0);
    const status = String(order.payment_status || '').toLowerCase();

    if (status === 'paid') {
      paidTotal += amount;
      paidCount++;
    } else if (status === 'pending') {
      pendingTotal += amount;
      pendingCount++;
    }
  });

  const formatCount = count =>
    `${count} ${count === 1 ? 'order' : 'orders'}`;

  setText('sum-all', money(paidTotal + pendingTotal));
  setText('sum-paid', money(paidTotal));
  setText('sum-pending', money(pendingTotal));

  setText('count-all', formatCount(orders.length));
  setText('count-paid', formatCount(paidCount));
  setText('count-pending', formatCount(pendingCount));
}


// ========================================
// FILTER BY STATUS
// ========================================

function updateFilter() {
  const selected = filter.querySelector(
    'input[name="status"]:checked'
  );

  const status = selected ? selected.value : '';
  let shown = 0;

  tbody.querySelectorAll('tr[data-status]').forEach(row => {
    row.hidden =
      status !== '' && row.dataset.status !== status;

    if (!row.hidden) shown++;
  });

  noPayments.hidden = shown > 0;
}

filter.addEventListener('change', updateFilter);


// ========================================
// MARK PAID
// PATCH /api/payments/{id}/paid
// ========================================

tbody.addEventListener('click', async event => {
  const button = event.target.closest('.mark-paid');

  if (!button) return;

  const orderId = button.dataset.id;

  button.disabled = true;
  button.textContent = 'Updating...';

  hideMessage();

  try {
    const response = await fetch(
      `/api/payments/${encodeURIComponent(orderId)}/paid`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const data = await getResponseData(response);

    // Reload only after a successful backend response.
    await loadPayments();

    showMessage(
      data.message || 'Order marked paid successfully.',
      'success'
    );

  } catch (error) {
    button.disabled = false;
    button.textContent = 'Mark paid';

    showMessage(
      error.message || 'Failed to update payment.'
    );
  }
});


// ========================================
// INITIAL LOAD
// ========================================

loadPayments();
