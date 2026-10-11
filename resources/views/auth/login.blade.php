<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Login | Restaurant Management</title>

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
            margin-bottom: 30px;
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
            margin-bottom: 22px;
        }

        .auth-heading h2 {
            margin: 0;
            font-size: 21px;
            font-weight: 700;
        }

        .auth-heading p {
            margin: 4px 0 0;
            color: var(--muted);
            font-size: 13px;
        }

        .status-message {
            margin-bottom: 16px;
            color: var(--ok);
            font-size: 13px;
        }

        .auth-field {
            display: grid;
            gap: 6px;
            margin-bottom: 17px;
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
            transition: border-color .2s, box-shadow .2s;
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

        .auth-options {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 4px 0 22px;
        }

        .remember-option {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: var(--muted);
            font-size: 13px;
            cursor: pointer;
        }

        .remember-option input {
            width: 15px;
            height: 15px;
            accent-color: var(--leaf);
            cursor: pointer;
        }

        .auth-link {
            color: var(--leaf-2);
            font-size: 13px;
            text-decoration: none;
        }

        .auth-link:hover {
            text-decoration: underline;
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
            transition: background .2s;
        }

        .auth-submit:hover {
            background: var(--haldi-dark);
        }

        .auth-submit:disabled {
            opacity: .7;
            cursor: wait;
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

        .register-prompt {
            margin: -8px 0 18px;
            text-align: center;
            color: var(--muted);
            font-size: 13px;
        }

        .register-prompt .auth-link {
            font-weight: 600;
        }

        @media (max-width: 480px) {
            .auth-page {
                padding: 16px;
            }

            .auth-card {
                padding: 24px 20px;
            }

            .auth-options {
                align-items: flex-start;
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
                <h2>Welcome back</h2>
                <p>Log in to manage your restaurant.</p>
            </div>

            {{-- Session Status --}}
            @if (session('status'))
                <div class="status-message" role="status">
                    {{ session('status') }}
                </div>
            @endif

            {{-- Login Form --}}
            <form id="login-form" method="POST" action="{{ route('login') }}">
                @csrf

                {{-- Email --}}
                <div class="auth-field">
                    <label for="email">Email address</label>

                    <input id="email" class="auth-input" type="email" name="email" value="{{ old('email') }}"
                        placeholder="you@example.com" required autofocus autocomplete="username"
                        aria-describedby="email-error">

                    @error('email')
                        <span id="email-error" class="error-message">
                            {{ $message }}
                        </span>
                    @enderror
                </div>

                {{-- Password --}}
                <div class="auth-field">
                    <label for="password">Password</label>

                    <input id="password" class="auth-input" type="password" name="password"
                        placeholder="Enter your password" required autocomplete="current-password"
                        aria-describedby="password-error">

                    @error('password')
                        <span id="password-error" class="error-message">
                            {{ $message }}
                        </span>
                    @enderror
                </div>

                {{-- Remember Me and Forgot Password --}}
                <div class="auth-options">
                    <label for="remember_me" class="remember-option">
                        <input id="remember_me" type="checkbox" name="remember" value="1">
                        <span>Remember me</span>
                    </label>

                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="auth-link">
                            Forgot password?
                        </a>
                    @endif
                </div>

                {{-- Register Link --}}
                <div class="register-prompt">
                    Don't have an account?
                    <a href="{{ route('register') }}" class="auth-link">Register here</a>
                </div>

                <button id="login-button" type="submit" class="auth-submit">
                    Log in
                </button>
            </form>

            <footer class="auth-footer">
                Restaurant Management System
            </footer>

        </section>
    </main>

    <script>
        const loginForm = document.getElementById('login-form');
        const loginButton = document.getElementById('login-button');

        loginForm.addEventListener('submit', function() {
            if (!loginForm.checkValidity()) {
                return;
            }

            loginButton.disabled = true;
            loginButton.textContent = 'Logging in...';
        });
    </script>
</body>

</html>
