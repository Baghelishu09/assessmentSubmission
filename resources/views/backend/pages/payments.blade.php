@extends('backend.layout.main')

@section('content')
    <style>
        [hidden] {
            display: none !important;
        }

        .payment-message {
            padding: 8px 10px;
            margin: 8px 0;
            font-size: 12px;
            border-radius: 5px;
        }

        .payment-message.error {
            color: #c62828;
            background: #fff0f0;
        }

        .payment-message.success {
            color: #187747;
            background: #eaf7ef;
        }

        button:disabled {
            opacity: .6;
            cursor: not-allowed;
        }
    </style>

    <main class="page">
        <header class="page-head">
            <div>
                <h1>Payment status</h1>
                <p>Which orders are paid and which are still pending.</p>
            </div>
        </header>

        <dl class="summary card">
            <div>
                <dt>Billed</dt>
                <dd id="sum-all">₹0.00</dd>
                <dd class="muted" id="count-all">0 orders</dd>
            </div>

            <div>
                <dt>Received</dt>
                <dd class="is-paid" id="sum-paid">₹0.00</dd>
                <dd class="muted" id="count-paid">0 orders</dd>
            </div>

            <div>
                <dt>Pending</dt>
                <dd class="is-pending" id="sum-pending">₹0.00</dd>
                <dd class="muted" id="count-pending">0 orders</dd>
            </div>
        </dl>

        <section class="card" aria-label="Payments">
            <div class="toolbar">
                <div class="chips" id="status-filter" role="radiogroup" aria-label="Payment status">

                    <label>
                        <input type="radio" name="status" value="" checked>
                        <span>All</span>
                    </label>

                    <label>
                        <input type="radio" name="status" value="paid">
                        <span>Paid</span>
                    </label>

                    <label>
                        <input type="radio" name="status" value="pending">
                        <span>Pending</span>
                    </label>
                </div>
            </div>

            <p id="payment-message" class="payment-message" role="status" aria-live="polite" hidden></p>

            <div class="table-wrap">
                <table class="table payments-table">
                    <thead>
                        <tr>
                            <th>Order no.</th>
                            <th>Date and time</th>
                            <th>Customer</th>
                            <th class="num">Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th class="num">Actions</th>
                        </tr>
                    </thead>

                    <tbody id="payment-rows">
                        <tr>
                            <td colspan="7">Loading payments...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p class="empty" id="no-payments" hidden>
                No orders with this status.
            </p>
        </section>
    </main>

    <script src="{{ asset('backend/assets/js/payments.js') }}" defer></script>
@endsection
