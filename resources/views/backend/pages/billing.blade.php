@extends('backend.layout.main')

@section('content')
    <style>
        [hidden] {
            display: none !important;
        }

        .billing-message {
            font-size: 12px;
            margin: 8px 0;
            padding: 8px;
            border-radius: 5px;
        }

        .billing-message.error {
            color: #c62828;
            background: #fff0f0;
        }

        .billing-message.success {
            color: #187747;
            background: #eaf7ef;
        }

        @media print {
            body * {
                visibility: hidden;
            }

            #receipt,
            #receipt * {
                visibility: visible;
            }

            #receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none;
            }
        }
    </style>

    <main class="page">
        <header class="page-head">
            <div>
                <h1>Billing</h1>
                <p>Item-wise bill for one order.</p>
            </div>
        </header>

        <div class="bill-layout">

            {{-- Order picker and details --}}
            <aside class="card bill-side">
                <div class="bill-pick">
                    <label class="field">
                        <span>Order</span>
                        <select id="order-select">
                            <option value="">Loading orders...</option>
                        </select>
                    </label>

                    <button class="btn" type="button" id="view-bill">
                        View bill
                    </button>
                </div>

                <p id="billing-message" class="billing-message" role="status" aria-live="polite" hidden></p>

                <dl class="info">
                    <div>
                        <dt>Order no.</dt>
                        <dd id="order-number">—</dd>
                    </div>
                    <div>
                        <dt>Date</dt>
                        <dd id="order-date">—</dd>
                    </div>
                    <div>
                        <dt>Customer</dt>
                        <dd id="order-customer">—</dd>
                    </div>
                    <div>
                        <dt>Table</dt>
                        <dd id="order-table">—</dd>
                    </div>
                    <div>
                        <dt>Payment</dt>
                        <dd id="order-payment-status">—</dd>
                    </div>
                    <div>
                        <dt>Method</dt>
                        <dd id="order-payment-method">—</dd>
                    </div>
                </dl>

                <div class="bill-actions">
                    <button class="btn btn-primary" type="button" id="print" disabled>
                        Print receipt
                    </button>

                    <a class="btn" href="{{ route('history') }}">
                        Order history
                    </a>
                </div>
            </aside>

            {{-- Receipt --}}
            <article class="receipt" id="receipt" data-tax-rate="5">
                <header class="receipt-head">
                    <h2>Restaurant name</h2>
                    <p>Address line, City</p>
                    <p>Phone 00000 00000</p>
                </header>

                <dl class="receipt-meta">
                    <div>
                        <dt>Order</dt>
                        <dd id="receipt-order-number">—</dd>
                    </div>
                    <div>
                        <dt>Date</dt>
                        <dd id="receipt-date">—</dd>
                    </div>
                    <div>
                        <dt>Table</dt>
                        <dd id="receipt-table">—</dd>
                    </div>
                    <div>
                        <dt>Customer</dt>
                        <dd id="receipt-customer">—</dd>
                    </div>
                </dl>

                <table class="receipt-items">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="num">Qty</th>
                            <th class="num">Price</th>
                            <th class="num">Amount</th>
                        </tr>
                    </thead>

                    <tbody id="bill-rows"></tbody>
                </table>

                <dl class="receipt-totals">
                    <div>
                        <dt>Items</dt>
                        <dd id="bill-count">0</dd>
                    </div>
                    <div>
                        <dt>Subtotal</dt>
                        <dd id="bill-subtotal">₹0.00</dd>
                    </div>
                    <div>
                        <dt>GST (5%)</dt>
                        <dd id="bill-tax">₹0.00</dd>
                    </div>
                    <div class="grand">
                        <dt>Total</dt>
                        <dd id="bill-total">₹0.00</dd>
                    </div>
                </dl>

                <p class="receipt-foot" id="receipt-footer">
                    Thank you. Visit again.
                </p>
            </article>
        </div>
    </main>

    <script src="{{ asset('backend/assets/js/billing.js') }}" defer></script>
@endsection
