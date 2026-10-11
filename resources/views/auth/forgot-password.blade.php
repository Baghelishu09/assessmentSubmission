<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Reset Password | Restaurant Management</title>

    <style>
        :root {
            --leaf: #143d2e;
            --leaf-2: #1d5240;
            --paper: #f2f4ef;
            --surface: #ffffff;
            --ink: #1b2420;
            --muted: #63706a;
            --line: #d9dfd8;
            --haldi: #f0b323;
            --haldi-dark: #d99c0b;
            --chili: #b93a26;
            --ok: #1f7a4d;
            --radius: 6px;
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font: 14px/1.5 "Segoe UI", system-ui, -apple-system,
                Roboto, Arial, sans-serif;
            color: var(--ink);
            background: var(--paper);
        }

        .auth-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .auth-card {
            width: 100%;
            max-width: 420px;
            padding: 30px;
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(20, 61, 46, 0.07);
        }

        .auth-brand {
            text-align: center;
            margin-bottom: 26px;
        }

        .brand-icon {
            display: grid;
            place-items: center;
            width: 48px;
            height: 48px;
            margin: 0 auto 12px;
            border-radius: 8px;
            background: var(--leaf);
            color: #fff;
            font-size: 24px;
            font-weight: 700;
        }

        .auth-brand h1 {
            margin: 0;
            color: var(--leaf);
            font-size: 23px;
            font-weight: 700;
        }

        .auth-brand p {
            margin: 3px 0 0;
            color: var(--muted);
            font-size: 13px;
        }

        .auth-heading {
            margin-bottom: 20px;
        }

        .auth-heading h2 {
            margin: 0;
            font-size: 21px;
            font-weight: 700;
        }

        .auth-heading p {
            margin: 5px 0 0;
            color: var(--muted);
            font-size: 13px;
        }

        .auth-field {
            display: grid;
            gap: 6px;
            margin-bottom: 16px;
        }

        .auth-field label {
            font-size: 13px;
            font-weight: 600;
        }

        .auth-input {
            display: block;
            width: 100%;
            height: 40px;
            padding: 0 11px;
            border: 1px solid var(--line);
            border-radius: var(--radius);
            background: var(--surface);
            color: var(--ink);
            font: inherit;
        }

        .auth-input:focus {
            outline: none;
            border-color: var(--leaf-2);
            box-shadow: 0 0 0 2px rgba(29, 82, 64, .12);
        }

        .auth-input::placeholder {
            color: #89928c;
        }

        .error-message {
            color: var(--chili);
            font-size: 12px;
        }

        .alert {
            margin-bottom: 16px;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 13px;
        }

        .alert-error {
            border: 1px solid #e8b4ad;
            background: #fff0ee;
            color: var(--chili);
        }

        .alert-success {
            border: 1px solid #b8dfc8;
            background: #e3f3ea;
            color: var(--ok);
        }

        .auth-submit {
            width: 100%;
            min-height: 40px;
            padding: 9px 14px;
            border: 1px solid var(--haldi-dark);
            border-radius: var(--radius);
            background: var(--haldi);
            color: #2e2100;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
        }

        .auth-submit:hover {
            background: var(--haldi-dark);
        }

        .auth-submit:disabled {
            opacity: .7;
            cursor: wait;
        }

        .auth-bottom {
            margin-top: 18px;
            text-align: center;
            color: var(--muted);
            font-size: 13px;
        }

        .auth-link {
            color: var(--leaf-2);
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
        }

        .auth-link:hover {
            text-decoration: underline;
        }

        .auth-footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--line);
            text-align: center;
            color: var(--muted);
            font-size: 12px;
        }

        :focus-visible {
            outline: 2px solid var(--leaf-2);
            outline-offset: 2px;
        }

        @media (max-width: 480px) {
            .auth-page {
                padding: 16px;
            }

            .auth-card {
                padding: 24px 20px;
            }
        }
    </style>
</head>

<body>
    <main class="auth-page">
        <section class="auth-card">

            <header class="auth-brand">
                <div class="brand-icon">R</div>
                <h1>Restaurant</h1>
                <p>Management panel</p>
            </header>

            <div class="auth-heading">
                <h2>Reset your password</h2>
                <p>Enter your email and current password, then choose a new password.</p>
            </div>

            {{-- Success Message --}}
            @if (session('success'))
                <div class="alert alert-success" role="status">
                    {{ session('success') }}
                </div>
            @endif

            {{-- Error Message --}}
            @if (session('error'))
                <div class="alert alert-error" role="alert">
                    {{ session('error') }}
                </div>
            @endif

            {{-- General Validation Errors --}}
            @if ($errors->any())
                <div class="alert alert-error" role="alert">
                    Please correct the errors below.
                </div>
            @endif

            <form id="reset-form" method="POST" action="{{ route('password.email') }}">
                @csrf

                {{-- Email --}}
                <div class="auth-field">
                    <label for="email">Email address</label>

                    <input id="email" class="auth-input" type="email" name="email" value="{{ old('email') }}"
                        placeholder="you@example.com" required autofocus autocomplete="username">

                    @error('email')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Old Password --}}
                <div class="auth-field">
                    <label for="old_password">Current password</label>

                    <input id="old_password" class="auth-input" type="password" name="old_password"
                        placeholder="Enter current password" required autocomplete="current-password">

                    @error('old_password')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                {{-- New Password --}}
                <div class="auth-field">
                    <label for="password">New password</label>

                    <input id="password" class="auth-input" type="password" name="password"
                        placeholder="Create a new password" required minlength="8" maxlength="12"
                        autocomplete="new-password">

                    @error('password')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Confirm Password --}}
                <div class="auth-field">
                    <label for="password_confirmation">Confirm new password</label>

                    <input id="password_confirmation" class="auth-input" type="password" name="password_confirmation"
                        placeholder="Enter new password again" required minlength="8" maxlength="12"
                        autocomplete="new-password">

                    @error('password_confirmation')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <button id="reset-button" type="submit" class="auth-submit">
                    Update password
                </button>
            </form>

            <div class="auth-bottom">
                Remembered your password?
                <a href="{{ route('login') }}" class="auth-link">Log in</a>
            </div>

            <footer class="auth-footer">
                Restaurant Management System
            </footer>

        </section>
    </main>

    <script>
        const resetForm = document.getElementById('reset-form');
        const resetButton = document.getElementById('reset-button');

        resetForm.addEventListener('submit', function() {
            if (!resetForm.checkValidity()) {
                return;
            }

            resetButton.disabled = true;
            resetButton.textContent = 'Updating password...';
        });
    </script>
</body>

</html>