# Restaurant Billing & Management System

A web-based Restaurant Billing & Management System developed using Laravel as part of a technical assessment. The application provides a simple interface for managing menu items, creating restaurant orders, generating bills, reviewing order history, and tracking payment status.

**Repository:** [assessmentSubmission](https://github.com/Baghelishu09/assessmentSubmission)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Database Design](#database-design)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Application Routes](#application-routes)
- [Authentication](#authentication)
- [Testing](#testing)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)

## Overview

The application supports the following restaurant workflow:

**Menu Management → Order Creation → Bill Generation → Payment Tracking → Order History**

It is designed to help restaurant staff manage menu items, record customer orders, generate itemized bills, and track whether an order has been paid.

## Features

### 1. Menu Management

- View menu items.
- Create menu categories.
- Add new menu items.
- Update existing menu items.
- Delete menu items.
- Update menu item availability/status.

### 2. Order Management

- View restaurant orders.
- Create orders containing menu items and quantities.
- Record customer names and table numbers.
- Store order items with their quantities and prices.
- Calculate and store subtotal, tax, and grand total.

### 3. Billing

- Retrieve orders for billing.
- Select an order and view its receipt.
- Display customer, table, and order information.
- Display ordered items, quantities, prices, and totals.
- View the recorded payment method and payment status.
- Print the bill using the browser's print functionality.

### 4. Order History

- View historical orders through the order history page.

### 5. Payment Management

- View orders and their payment statuses.
- View total revenue and revenue grouped by payment status.
- Filter orders by payment status.
- Mark an order as paid.
- Navigate from a payment record to its associated bill.

### 6. Authentication and UI

- Login and registration interfaces based on Laravel Breeze authentication scaffolding.
- Custom login and registration page styling.
- Form validation and error messages.
- Registration restricted to the first user according to the current application logic.
- Custom password update flow that checks the registered email and current password before updating the password.
- Protected application pages using authentication and email-verification middleware.

## Technology Stack

| Technology | Purpose |
|---|---|
| PHP 8.2 | Backend programming language |
| Laravel 12 | Web application framework |
| Laravel Blade | Server-rendered views |
| Laravel Breeze | Authentication scaffolding |
| MySQL | Relational database |
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Dynamic page interactions |
| Fetch API | Frontend-to-backend API requests |
| Composer | PHP dependency management |
| npm | Frontend dependency management and asset building |

## Application Architecture

The application uses Laravel for server-side processing, Blade for page rendering, JavaScript for dynamic interactions, and MySQL for persistent data storage.

### Web Layer

The `routes/web.php` file defines the browser-facing pages:

- `/dashboard` — Menu management
- `/orders` — Order management
- `/billing` — Billing and receipt interface
- `/history` — Order history
- `/payments` — Payment management

The application pages are protected by authentication and email-verification middleware.

### API Layer

The `routes/api.php` file defines endpoints used by JavaScript to retrieve and modify application data.

These endpoints handle menu operations, category creation, order creation, billing data, order history, and payment updates.

### Backend Layer

Laravel controllers process requests and coordinate application logic and database operations. Eloquent models represent database entities and their relationships.

### Frontend Layer

Blade templates provide the HTML structure. CSS provides the custom restaurant management theme, and JavaScript uses the Fetch API to retrieve data and update the interface.

### Request Flow

```text
Browser
   |
   v
Blade Page
   |
   v
JavaScript / Fetch API
   |
   v
Laravel API Route
   |
   v
Controller
   |
   v
Eloquent Model
   |
   v
MySQL Database
   |
   v
JSON Response
   |
   v
Updated Interface
```

## Database Design

The application uses a MySQL database named `restaurant`.

Database tables are managed through Laravel migrations. The main data entities include:

| Entity | Purpose |
|---|---|
| Users | Stores user and authentication information |
| Categories | Organizes menu items |
| Menu Items | Stores menu item information, prices, and availability |
| Orders | Stores customer, table, totals, and payment information |
| Order Items | Stores the individual items associated with an order |

An order can contain multiple order items. Each order item belongs to an order and references a menu item.

The project's migrations define the actual table structures and relationships.

## Installation and Setup

### Prerequisites

Install the following tools:

- PHP 8.2 or a compatible supported version
- Composer
- MySQL Server
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Baghelishu09/assessmentSubmission.git
cd assessmentSubmission
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Configure the Environment

Create the local environment file.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

If a local `.env` file already exists, preserve it and configure it instead of overwriting it.

### 4. Configure MySQL

Create a MySQL database named `restaurant`.

Update the database configuration in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

Replace the username and password with your local MySQL credentials.

### 5. Run Database Migrations

```bash
php artisan migrate
```

This creates the tables defined by the project's migrations.

### 6. Install and Build Frontend Assets

Install the npm dependencies:

```bash
npm install
```

Build the frontend assets:

```bash
npm run build
```

### 7. Start the Application

```bash
php artisan serve
```

Open the application in your browser:

http://127.0.0.1:8000

## Running the Application

1. Open the application in your browser.
2. Register the initial user if no user exists.
3. Log in using the registered account.
4. Manage menu categories and items.
5. Create an order with the required menu items and quantities.
6. Open the Billing page and select the order.
7. View and print the generated bill.
8. Use the Payments page to review and update payment status.
9. Open Order History to review recorded orders.

**Registration note:** The current registration controller permits registration only when no user exists in the database. Additional registrations are blocked by the application logic.

## Application Routes

### Web Routes

| Route | Purpose |
|---|---|
| `/dashboard` | Menu management |
| `/orders` | Order management |
| `/billing` | Billing and receipt interface |
| `/history` | Order history |
| `/payments` | Payment management |

### API Endpoints

The following endpoints are defined in `routes/api.php`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/categories` | Create a category |
| GET | `/api/menu` | Retrieve menu data |
| POST | `/api/menu/store` | Create a menu item |
| PUT | `/api/menu/{id}/update` | Update a menu item |
| DELETE | `/api/menu/{id}` | Delete a menu item |
| PATCH | `/api/menu/{id}` | Update menu item status |
| GET | `/api/order` | Retrieve order data |
| POST | `/api/order` | Create an order |
| GET | `/api/billing` | Retrieve orders for billing |
| GET | `/api/billing/{id}/receipt` | Retrieve a specific order receipt |
| GET | `/api/history` | Retrieve order history |
| GET | `/api/payments` | Retrieve payment and revenue data |
| PATCH | `/api/payments/{id}/paid` | Mark an order as paid |

These API endpoints are intended for the application's frontend. Their actual behavior is implemented in the corresponding controllers.

## Authentication

The application uses Laravel Breeze authentication scaffolding with customized Blade interfaces.

Registration is restricted to the initial user by the current registration controller. Login and protected page access use Laravel's authentication system.

The password update flow is customized to verify the registered email address and current password before saving a new password. It is not the standard email-based password-reset-link workflow.

No demo credentials are published in this README.

## Testing

The application was tested manually during development.

Manual testing focused on the application's main workflows, including menu management, order creation, billing, payment status updates, authentication screens, and navigation.

Automated test coverage has not been claimed in this README.

## Known Issues

No specific known issues have been reported for this submission.

This does not imply that every possible scenario has been exhaustively tested.

## Future Improvements

Potential improvements include:

- Automated unit and feature tests.
- Role-based access control for restaurant staff and administrators.
- Downloadable PDF receipts.
- Payment gateway integration.
- Email receipts and notifications.
- More detailed sales and revenue reports.
- Improved audit logging for order and payment changes.
- Additional production deployment and performance testing.

## Security

- Keep `.env` and database credentials private.
- Do not commit passwords, API keys, or other secrets.
- Use an appropriate application key and secure configuration for each environment.
- Configure HTTPS and production settings before deployment.

## License

No separate project license has been specified.
