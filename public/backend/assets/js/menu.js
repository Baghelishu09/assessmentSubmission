'use strict';


const search = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const filterStatus = document.getElementById('filter-status');

const menuRows = document.getElementById('menu-rows');
const itemCount = document.getElementById('item-count');
const noItems = document.getElementById('no-items');
const menuMessage = document.getElementById('menu-message');

const itemForm = document.getElementById('item-form');
const itemFormTitle = document.getElementById('item-form-title');
const itemCategory = itemForm.querySelector('[name="category_id"]');
const itemSubmitButton = itemForm.querySelector('[type="submit"]');
const cancelEditButton = document.getElementById('cancel-edit');
const itemMessage = document.getElementById('item-message');

const categoryForm = document.getElementById('categoryForm');
const categoryList = document.getElementById('category-list');
const categoryMessage = document.getElementById('category-message');

let menuItems = [];
let categories = [];
let editingItemId = null;


// ========================================
// MESSAGE HELPERS
// ========================================

function showMessage(element, message, type = '') {
  element.textContent = message;
  element.className = `form-message ${type}`;
  element.hidden = false;
}

function hideMessage(element) {
  element.textContent = '';
  element.className = 'form-message';
  element.hidden = true;
}


// ========================================
// FETCH RESPONSE HELPER
// ========================================

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
// LOAD MENU AND CATEGORIES
// ========================================

async function loadMenuData() {
  itemCount.textContent = 'Loading menu items...';
  hideMessage(menuMessage);

  try {
    const response = await fetch('/api/menu', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    menuItems = data.items || [];
    categories = data.categories || [];

    renderCategoryDropdowns();
    renderCategoryList();
    renderMenu();

  } catch (error) {
    itemCount.textContent = 'Unable to load menu items.';

    showMessage(
      menuMessage,
      error.message || 'Failed to load menu.',
      'error'
    );
  }
}


// ========================================
// CATEGORY DROPDOWNS
// ========================================

function renderCategoryDropdowns() {
  const selectedFilter = filterCategory.value;
  const selectedItemCategory = itemCategory.value;

  filterCategory.replaceChildren(
    new Option('All categories', '')
  );

  itemCategory.replaceChildren(
    new Option('Select category', '')
  );

  categories.forEach(category => {
    filterCategory.add(
      new Option(category.name, String(category.id))
    );

    itemCategory.add(
      new Option(category.name, String(category.id))
    );
  });

  if (
    [...filterCategory.options].some(
      option => option.value === selectedFilter
    )
  ) {
    filterCategory.value = selectedFilter;
  }

  if (
    [...itemCategory.options].some(
      option => option.value === selectedItemCategory
    )
  ) {
    itemCategory.value = selectedItemCategory;
  }
}


// ========================================
// CATEGORY LIST
// ========================================

function renderCategoryList() {
  categoryList.replaceChildren();

  categories.forEach(category => {
    const li = document.createElement('li');

    const name = document.createElement('span');
    name.textContent = category.name;

    const count = document.createElement('span');
    count.className = 'muted';

    const total =
      category.items_count ??
      category.menu_items_count ??
      0;

    count.textContent =
      `${total} ${Number(total) === 1 ? 'item' : 'items'}`;

    li.append(name, count);
    categoryList.append(li);
  });
}


// ========================================
// RENDER MENU TABLE
// ========================================

function renderMenu() {
  menuRows.replaceChildren();

  menuItems.forEach(item => {
    const row = document.createElement('tr');

    row.dataset.id = item.id;
    row.dataset.category = item.category_id;

    // Item name
    const nameCell = document.createElement('td');
    nameCell.className = 'c-name';
    nameCell.textContent = item.name;

    // Category
    const categoryCell = document.createElement('td');
    categoryCell.className = 'c-cat muted';
    categoryCell.textContent =
      item.category?.name ?? 'Uncategorized';

    // Price
    const priceCell = document.createElement('td');
    priceCell.className = 'c-price num';
    priceCell.textContent =
      `₹${Number(item.price).toFixed(2)}`;

    // Availability toggle
    const statusCell = document.createElement('td');
    statusCell.className = 'c-status';

    const label = document.createElement('label');
    label.className = 'switch';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Number(item.is_available) === 1;
    checkbox.dataset.id = item.id;
    checkbox.setAttribute(
      'aria-label',
      `Availability for ${item.name}`
    );

    const track = document.createElement('span');
    track.className = 'track';

    const state = document.createElement('span');
    state.className = 'state';

    label.append(checkbox, track, state);
    statusCell.append(label);

    // Actions
    const actionCell = document.createElement('td');
    actionCell.className = 'c-act';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-sm';
    editButton.textContent = 'Edit';
    editButton.dataset.action = 'edit';
    editButton.dataset.id = item.id;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-sm btn-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = item.id;

    actions.append(editButton, deleteButton);
    actionCell.append(actions);

    row.append(
      nameCell,
      categoryCell,
      priceCell,
      statusCell,
      actionCell
    );

    menuRows.append(row);
  });

  filterItems();
}


// ========================================
// SEARCH AND FILTERS
// ========================================

function filterItems() {
  const text = search.value.trim().toLowerCase();
  const selectedCategory = filterCategory.value;
  const selectedStatus = filterStatus.value;

  let shown = 0;

  menuRows.querySelectorAll('tr').forEach(row => {
    const itemName = row
      .querySelector('.c-name')
      .textContent.toLowerCase();

    const checkbox = row.querySelector('.switch input');
    const available = checkbox.checked ? '1' : '0';

    const matches =
      itemName.includes(text) &&
      (!selectedCategory ||
        row.dataset.category === selectedCategory) &&
      (!selectedStatus || available === selectedStatus);

    row.hidden = !matches;

    if (matches) {
      shown++;
    }
  });

  noItems.hidden = shown > 0;

  itemCount.textContent =
    `Showing ${shown} of ${menuItems.length} items`;
}

search.addEventListener('input', filterItems);
filterCategory.addEventListener('change', filterItems);
filterStatus.addEventListener('change', filterItems);


// ========================================
// ADD CATEGORY
// POST /api/categories
// ========================================

categoryForm.addEventListener('submit', submitCategoryForm);

async function submitCategoryForm(event) {
  event.preventDefault();

  const input = categoryForm.querySelector(
    '[name="category_name"]'
  );

  const button = categoryForm.querySelector(
    'button[type="submit"]'
  );

  const categoryName = input.value.trim();

  hideMessage(categoryMessage);

  if (!categoryName) {
    showMessage(
      categoryMessage,
      'Please enter a category name.',
      'error'
    );

    input.focus();
    return;
  }

  button.disabled = true;

  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        category_name: categoryName
      })
    });

    const data = await getResponseData(response);

    categoryForm.reset();

    await loadMenuData();

    showMessage(
      categoryMessage,
      data.message || 'Category added successfully.',
      'success'
    );

  } catch (error) {
    showMessage(
      categoryMessage,
      error.message || 'Failed to add category.',
      'error'
    );

  } finally {
    button.disabled = false;
  }
}


// ========================================
// ADD OR UPDATE MENU ITEM
// POST /api/menu/store
// PUT  /api/menu/{id}/update
// ========================================

itemForm.addEventListener('submit', submitItemForm);

async function submitItemForm(event) {
  event.preventDefault();

  hideMessage(itemMessage);

  if (!itemForm.reportValidity()) {
    return;
  }

  const formData = new FormData(itemForm);

  const payload = {
    name: formData.get('name').trim(),
    price: formData.get('price'),
    category_id: formData.get('category_id'),
    is_available: formData.get('is_available')
  };

  const isEditing = editingItemId !== null;

  const url = isEditing
    ? `/api/menu/${editingItemId}/update`
    : '/api/menu/store';

  itemSubmitButton.disabled = true;
  cancelEditButton.disabled = true;

  itemSubmitButton.textContent = isEditing
    ? 'Updating...'
    : 'Saving...';

  try {
    const response = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await getResponseData(response);

    resetItemForm();

    await loadMenuData();

    showMessage(
      itemMessage,
      data.message || (
        isEditing
          ? 'Item updated successfully.'
          : 'Item added successfully.'
      ),
      'success'
    );

  } catch (error) {
    showMessage(
      itemMessage,
      error.message || 'Unable to save item.',
      'error'
    );

  } finally {
    itemSubmitButton.disabled = false;
    cancelEditButton.disabled = false;

    itemSubmitButton.textContent =
      editingItemId !== null ? 'Update item' : 'Save item';
  }
}

function startEdit(itemId) {
  const item = menuItems.find(
    menuItem => Number(menuItem.id) === Number(itemId)
  );

  if (!item) {
    showMessage(menuMessage, 'Item not found.', 'error');
    return;
  }

  editingItemId = item.id;

  itemForm.querySelector('[name="name"]').value = item.name;
  itemForm.querySelector('[name="price"]').value = item.price;
  itemCategory.value = String(item.category_id);

  itemForm.querySelector('[name="is_available"]').value =
    Number(item.is_available) === 1 ? '1' : '0';

  itemFormTitle.textContent = 'Edit item';
  itemSubmitButton.textContent = 'Update item';
  cancelEditButton.hidden = false;

  hideMessage(itemMessage);

  itemForm.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}


// ========================================
// RESET / CANCEL EDIT
// ========================================

function resetItemForm() {
  editingItemId = null;

  itemForm.reset();

  itemForm.querySelector('[name="is_available"]').value = '1';

  itemFormTitle.textContent = 'Add item';
  itemSubmitButton.textContent = 'Save item';
  cancelEditButton.hidden = true;

  hideMessage(itemMessage);
}

cancelEditButton.addEventListener('click', resetItemForm);


// ========================================
// DELETE MENU ITEM
// DELETE /api/menu/{id}
// ========================================

async function deleteItem(itemId) {
  const item = menuItems.find(
    menuItem => Number(menuItem.id) === Number(itemId)
  );

  if (!item) {
    showMessage(menuMessage, 'Item not found.', 'error');
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${item.name}"?`
  );

  if (!confirmed) {
    return;
  }

  hideMessage(menuMessage);

  try {
    const response = await fetch(`/api/menu/${itemId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await getResponseData(response);

    if (Number(editingItemId) === Number(itemId)) {
      resetItemForm();
    }

    await loadMenuData();

    showMessage(
      menuMessage,
      data.message || 'Item deleted successfully.',
      'success'
    );

  } catch (error) {
    showMessage(
      menuMessage,
      error.message || 'Failed to delete item.',
      'error'
    );
  }
}


// ========================================
// TOGGLE ITEM AVAILABILITY
// PATCH /api/menu/{id}
// ========================================

async function toggleItemStatus(checkbox) {
  const itemId = checkbox.dataset.id;
  const previousStatus = !checkbox.checked;

  checkbox.disabled = true;
  hideMessage(menuMessage);

  try {
    const response = await fetch(`/api/menu/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        is_available: checkbox.checked ? 1 : 0
      })
    });

    const data = await getResponseData(response);

    // Update local data after the server confirms the change.
    const item = menuItems.find(
      menuItem => Number(menuItem.id) === Number(itemId)
    );

    if (item) {
      item.is_available = checkbox.checked ? 1 : 0;
    }

    filterItems();

    showMessage(
      menuMessage,
      data.message || 'Status updated successfully.',
      'success'
    );

  } catch (error) {
    // Restore the previous state if the request fails.
    checkbox.checked = previousStatus;

    filterItems();

    showMessage(
      menuMessage,
      error.message || 'Failed to update status.',
      'error'
    );

  } finally {
    checkbox.disabled = false;
  }
}


// ========================================
// TABLE ACTION EVENTS
// ========================================

menuRows.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const itemId = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'edit') {
    startEdit(itemId);
  }

  if (action === 'delete') {
    deleteItem(itemId);
  }
});

menuRows.addEventListener('change', event => {
  const checkbox = event.target.closest('.switch input');

  if (!checkbox) {
    return;
  }

  toggleItemStatus(checkbox);
});

loadMenuData();