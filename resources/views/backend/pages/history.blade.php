@extends('backend.layout.main')

@section('content')
    <style>
        [hidden] {
            display: none !important;
        }

        .history-message {
            margin: 8px 0;
            padding: 8px 10px;
            font-size: 12px;
            border-radius: 5px;
        }

        .history-message.error {
            color: #c62828;
            background: #fff0f0;
        }
    </style>

    <main class="page">
        <header class="page-head">
            <div>
                <h1>Order history</h1>
                <p>All past orders, newest first.</p>
            </div>

            <a class="btn btn-primary" href="{{ url('orders') }}">
                New order
            </a>
        </header>

        <section class="card" aria-label="Past orders">
            <div class="toolbar">
                <input class="grow" type="search" id="search" placeholder="Search order no. or customer"
                    aria-label="Search order number or customer">

                <label class="date-field">
                    <span>From</span>
                    <input type="date" id="date-from">
                </label>

                <label class="date-field">
                    <span>To</span>
                    <input type="date" id="date-to">
                </label>
            </div>

            <p id="history-message" class="history-message" role="status" aria-live="polite" hidden></p>

            <div class="table-wrap">
                <table class="table history-table">
                    <thead>
                        <tr>
                            <th>Order no.</th>
                            <th>Date and time</th>
                            <th>Customer</th>
                            <th>Table</th>
                            <th class="num">Items</th>
                            <th class="num">Total</th>
                            <th>Payment</th>
                            <th class="num">Bill</th>
                        </tr>
                    </thead>

                    <tbody id="order-rows">
                        <tr>
                            <td colspan="8">Loading orders...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p class="empty" id="no-orders" hidden>
                No orders match this search.
            </p>

            <p class="table-foot" id="order-count">
                Loading orders...
            </p>
        </section>
    </main>

    <script src="{{ asset('backend/assets/js/history.js') }}" defer></script>
@endsection
