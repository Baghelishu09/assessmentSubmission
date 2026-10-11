@extends('backend.layout.main')

@section('content')
    <style>
        .form-message {
            font-size: 11px;
            line-height: 1.4;
            margin: 6px 0 0;
            padding: 6px 9px;
            border-radius: 5px;
            overflow-wrap: anywhere;
        }

        .form-message.success {
            color: #187747;
            background: #eaf7ef;
            border: 1px solid #c8ead5;
        }

        .form-message.error {
            color: #c62828;
            background: #fff0f0;
            border: 1px solid #f5cccc;
        }

        .form-message[hidden],
        [hidden] {
            display: none !important;
        }

        button:disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }

        .form-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
    </style>

    <main class="page">
        <header class="page-head">
            <div>
                <h1>Menu items</h1>
                <p>Food items with price, category and availability.</p>
            </div>

            <a class="btn btn-primary add-link" href="#item-form">
                Add item
            </a>
        </header>

        <div class="menu-layout">

            {{-- Menu items table --}}
            <section class="card" aria-label="Food items">
                <div class="toolbar">
                    <input class="grow" type="search" id="search" placeholder="Search item name"
                        aria-label="Search item name">

                    <select id="filter-category" aria-label="Filter by category">
                        <option value="">All categories</option>
                    </select>

                    <select id="filter-status" aria-label="Filter by availability">
                        <option value="">Any status</option>
                        <option value="1">Available</option>
                        <option value="0">Unavailable</option>
                    </select>
                </div>

                <div class="table-wrap">
                    <table class="table menu-table">
                        <thead>
                            <tr>
                                <th>Item name</th>
                                <th>Category</th>
                                <th class="num">Price</th>
                                <th>Status</th>
                                <th class="num">Actions</th>
                            </tr>
                        </thead>

                        <tbody id="menu-rows"></tbody>
                    </table>
                </div>

                <p class="empty" id="no-items" hidden>
                    No items match these filters.
                </p>

                <p class="table-foot" id="item-count">
                    Loading menu items...
                </p>

                <p id="menu-message" class="form-message" role="status" aria-live="polite" hidden></p>
            </section>

            <div class="menu-side">

                {{-- Add / edit item form --}}
                <form class="card" id="item-form">
                    <h2 class="card-head" id="item-form-title">Add item</h2>

                    <div class="card-body form-grid">
                        <label class="field wide">
                            <span>Item name</span>
                            <input type="text" name="name" placeholder="e.g. Masala Dosa" maxlength="100" required>
                        </label>

                        <label class="field">
                            <span>Price (₹)</span>
                            <input type="number" name="price" min="0.01" step="0.01" placeholder="0" required>
                        </label>

                        <label class="field">
                            <span>Category</span>
                            <select name="category_id" required>
                                <option value="">Select category</option>
                            </select>
                        </label>

                        <label class="field wide">
                            <span>Status</span>
                            <select name="is_available">
                                <option value="1">Available</option>
                                <option value="0">Unavailable</option>
                            </select>
                        </label>

                        <div class="form-actions wide">
                            <button class="btn btn-primary" type="submit">
                                Save item
                            </button>

                            <button class="btn" type="button" id="cancel-edit" hidden>
                                Cancel edit
                            </button>
                        </div>

                        <p id="item-message" class="form-message wide" role="status" aria-live="polite" hidden></p>
                    </div>
                </form>

                {{-- Categories --}}
                <section class="card">
                    <h2 class="card-head">Categories</h2>

                    <ul class="cat-list" id="category-list"></ul>

                    <form class="cat-add" id="categoryForm">
                        <input type="text" name="category_name" placeholder="New category" aria-label="New category name"
                            maxlength="100" required>

                        <button class="btn" type="submit">Add</button>
                    </form>

                    <p id="category-message" class="form-message" role="status" aria-live="polite" hidden></p>
                </section>

            </div>
        </div>
    </main>

    <script src="{{ asset('backend/assets/js/menu.js') }}" defer></script>
@endsection
