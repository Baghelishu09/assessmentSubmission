<nav class="nav" aria-label="Main">
    <a class="brand" href="{{ route('dashboard') }}">
        Restaurant <span>Management panel</span>
    </a>

    <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">Menu</a>

    <a class="nav-link {{ request()->routeIs('orders') ? 'active' : '' }}" href="{{ route('orders') }}">Orders</a>

    <a class="nav-link {{ request()->routeIs('billing') ? 'active' : '' }}" href="{{ route('billing') }}">Billing</a>

    <a class="nav-link {{ request()->routeIs('history') ? 'active' : '' }}" href="{{ route('history') }}">History</a>

    <a class="nav-link {{ request()->routeIs('payments') ? 'active' : '' }}"
        href="{{ route('payments') }}">Payments</a>

    <form method="POST" action="{{ route('logout') }}" style="margin: auto 0 0;">
        @csrf
        <button type="submit" class="nav-link"
            style="width: 100%; text-align: left; background: none; border: none; cursor: pointer; font: inherit;">
            Logout
        </button>
    </form>
</nav>
