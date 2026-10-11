@extends('backend.layout.main')

@section('content')
    <style>
        [hidden] {
            display: none !important;
        }

        .order-message {
            margin: 8px 0;
            padding: 8px 10px;
            font-size: 12px;
            border-radius: 5px;
        }

        .order-message.error {
            color: #c62828;
            background: #fff0f0;
        }

        .order-message.success {
            color: #187747;
            background: #eaf7ef;
        }

        .item:disabled,
        button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    </style>

    <main class="page">
        <header class="page-head">
            <div>
                <h1>New order</h1>
                <p>Tap an item to add it. Change the quantity in the order panel.</p>
            </div>
        </header>

        <div class="order-layout">

            {{-- Menu item picker --}}
            <section class="card picker" aria-label="Menu items">
                <div class="chips" id="categories" role="radiogroup" aria-label="Category">
                    <label>
                        <input type="radio" name="category" value="" checked>
                        <span>All</span>
                    </label>
                </div>

                <p id="items-message" class="order-message" hidden></p>

                <div class="items" id="items">
                    <p>Loading menu items...</p>
                </div>
            </section>

            {{-- Current order --}}
            <form class="card order-panel" id="order-panel">
                <h2 class="card-head">Current order</h2>

                <div class="order-fields">
                    <label class="field">
                        <span>Customer name</span>
                        <input type="text" name="customer_name" placeholder="Walk-in">
                    </label>

                    <label class="field">
                        <span>Table</span>
                        <select name="table_no">
                            <option value="Table 1">Table 1</option>
                            <option value="Table 2">Table 2</option>
                            <option value="Table 3">Table 3</option>
                            <option value="Table 4">Table 4</option>
                            <option value="Table 5">Table 5</option>
                            <option value="Table 6">Table 6</option>
                            <option value="Takeaway">Takeaway</option>
                        </select>
                    </label>
                </div>

                <ul class="cart" id="cart-list" aria-label="Selected items"></ul>

                <p class="empty cart-empty" id="cart-empty">
                    No items yet. Tap an item to add it.
                </p>

                <dl class="totals" id="totals" data-tax-rate="5">
                    <div>
                        <dt>Subtotal</dt>
                        <dd id="subtotal">₹0.00</dd>
                    </div>

                    <div>
                        <dt>GST (5%)</dt>
                        <dd id="tax">₹0.00</dd>
                    </div>

                    <div class="grand">
                        <dt>Total</dt>
                        <dd id="total">₹0.00</dd>
                    </div>
                </dl>

                <div class="order-fields">
                    <label class="field">
                        <span>Payment status</span>
                        <select name="payment_status">
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                    </label>

                    <label class="field">
                        <span>Payment method</span>
                        <select name="payment_method">
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                        </select>
                    </label>
                </div>

                <p id="order-message" class="order-message" hidden></p>

                <div class="order-actions">
                    <button class="btn" type="reset">Clear</button>

                    <button class="btn btn-primary" type="submit" id="place-order" disabled>
                        Place order
                    </button>
                </div>
            </form>
        </div>

        {{-- Mobile order summary bar --}}
        <a class="order-bar" href="#order-panel">
            <span id="bar-count">0 items</span>
            <strong id="bar-total">₹0.00</strong>
            <span class="order-bar-go">View order</span>
        </a>
    </main>

    {{-- Cart row template --}}
    <template id="cart-row">
        <li>
            <div class="cart-info">
                <span class="cart-name"></span>
                <span class="cart-price muted"></span>
            </div>

            <div class="stepper">
                <button type="button" data-step="-1" aria-label="Decrease quantity">&minus;</button>

                <output class="qty"></output>

                <button type="button" data-step="1" aria-label="Increase quantity">+</button>
            </div>

            <span class="cart-amount num"></span>

            <input type="hidden">
        </li>
    </template>

    <script src="{{ asset('backend/assets/js/orders.js') }}" defer></script>
@endsection
