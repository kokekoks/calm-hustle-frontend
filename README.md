# Calm Hustle Co. - Frontend

React + Vite + Material UI product catalog for Calm Hustle Co. It connects to the Laravel REST API through Axios and supports registration, login, logout, protected routes and role-based product management.

## Group

- Group name: ``Calm Hustle Co.`
-  Members: `<Member 1 (charmdx01)>`, `<Member 2 (youngneilcedric-tech)>`, `<Member 3 (johnyslice4)>`
- Backend repository: https://github.com/kokekoks/calm-hustle-backend

## Prerequisites

- Node.js 18 or newer and npm
- The backend API running locally (see the backend README)
- Git

## Installation

```bash
git clone https://github.com/kokekoks/calm-hustle-frontend.git
cd calm-hustle-frontend
npm install
```

## Environment variables

Copy `.env.example` to `.env` (never commit `.env`):

```
VITE_API_BASE_URL=http://localhost:8000/api
```

On Windows PowerShell, use `copy .env.example .env`. Restart `npm run dev` after changing `.env`.

## Run locally

Start the backend first (`php artisan serve`), then:

```bash
npm run dev
```

Open http://localhost:5173.

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

## Routes

| Path | Access |
|---|---|
| `/login` | Guests (signed-in users are redirected to `/`) |
| `/register` | Guests |
| `/` | Signed-in users (product catalog) |
| `/products/:id` | Signed-in users (product details) |

Guests who open a protected page are redirected to `/login`.

## Authentication flow

1. Register creates a customer account, then redirects to Login.
2. Login stores the bearer token and safe user information in `localStorage`.
3. An Axios request interceptor sends `Authorization: Bearer <token>` with every request.
4. A response interceptor clears the stored session when the API returns `401`, and the app redirects to `/login`.
5. Logout calls `POST /logout`, clears local state and redirects to `/login`.

## Roles and UI behavior

| User | Catalog |
|---|---|
| Customer | Can list and view products. Add, Edit, Delete and Add Brand are hidden. |
| Administrator | Can also add, edit and delete products and add brands. |

Hiding controls only improves the experience. The backend enforces the permissions: guests get `401` and customers get `403` on restricted requests. A `403` response shows an access-denied message.

## Project structure

```
src/
  api/          axios.js, productApi.js
  components/   Header, ProductCard, ProductFormDialog, DeleteProductDialog,
                ProtectedRoute, AdminRoute
  context/      AuthContext, useAuth
  layouts/      MainLayout
  pages/        LoginPage, RegisterPage, ProductListPage,
                ProductDetailsPage, NotFoundPage
  theme/        theme.js
```

## Sample accounts

- Administrator: the account seeded by the backend (see the backend README).
- Customer: create one on the Register page.

No real passwords are stored in this repository.

## Known limitations

- The token is kept in `localStorage`, which is acceptable for classwork but exposed to XSS. A production app should prefer secure HttpOnly cookies.
- Size buttons on the product details page are UI only.
- The product image is an image URL, not an uploaded file.