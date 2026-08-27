# 📦 Order Management System

A secure full-stack **Order Management System** built using **Node.js, Express.js, MySQL, and JWT Authentication**.

The application provides a centralized system for managing customers, items, inventory, and orders. It also implements customer priority handling, stock validation, automatic order-total calculation, and discount support.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User authentication using **JWT**
* Protected API routes
* Secure password handling
* Token-based authorization

### 👤 Customer Management

* Create and manage customers
* Customer priority handling
* Retrieve customer information
* Associate customers with orders

### 📦 Item Management

* Add new items
* Update item information
* View available items
* Maintain item prices and stock quantities

### 🛒 Order Management

* Create new orders
* Add multiple items to an order
* Validate item availability
* Automatically calculate order totals
* Apply discounts based on business rules
* Track order information

### 📊 Inventory Management

* Maintain item stock
* Check stock availability before placing an order
* Automatically update stock after successful orders
* Prevent orders when sufficient stock is unavailable

---

## 🧠 Business Logic

The system follows a basic order-processing workflow:

```text
Customer
   │
   ▼
Select Items
   │
   ▼
Check Stock
   │
   ├── Insufficient Stock ──► Reject Order
   │
   ▼
Calculate Item Total
   │
   ▼
Apply Discount
   │
   ▼
Create Order
   │
   ▼
Update Inventory
```

### Order Total Calculation

The system calculates the order amount dynamically based on:

```text
Item Price × Quantity
        ↓
Subtotal
        ↓
Discount
        ↓
Final Order Total
```

---

## 🛠️ Tech Stack

| Technology              | Purpose                        |
| ----------------------- | ------------------------------ |
| **Node.js**             | Backend runtime                |
| **Express.js**          | REST API framework             |
| **MySQL**               | Relational database            |
| **JWT**                 | Authentication & authorization |
| **JavaScript**          | Application logic              |
| **HTML/CSS/JavaScript** | Frontend                       |
| **npm**                 | Dependency management          |

---

## 🏗️ Project Structure

```text
Order-Management-System/
│
├── client/
│   └── ...                 # Frontend application
│
├── src/
│   ├── ...                 # Backend source code
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── ...
│
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

> The exact folders inside `src/` may vary as the project evolves.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mayamandal-matureDeveloper/Order-Management-System.git
```

### 2. Navigate to the project

```bash
cd Order-Management-System
```

### 3. Install dependencies

```bash
npm install
```

---

## 🗄️ Database Setup

Make sure **MySQL** is installed and running.

Create a database for the application:

```sql
CREATE DATABASE order_management;
```

Then configure your database connection in the `.env` file.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=order_management

JWT_SECRET=your_secret_key
```

> Do not commit your real `.env` file or database credentials to GitHub.

---

## ▶️ Running the Application

Start the backend server:

```bash
npm start
```

For development, if your project uses nodemon:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5000
```

---

## 🔑 Authentication

The application uses **JSON Web Tokens (JWT)** for authentication.

Typical authentication flow:

```text
User Login
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Client Stores Token
    ↓
Token Sent With Protected Requests
    ↓
JWT Middleware Validates Token
    ↓
Access Granted
```

Protected requests should include the token using the authorization header:

```http
Authorization: Bearer <your_token>
```

---

## 📡 API Overview

The backend provides APIs for managing:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Customers

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Items

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

### Orders

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

> Update these endpoint names if your actual routes differ.

---

## 🔄 Example Order Flow

Suppose a customer wants to purchase:

```text
Item       Price      Quantity
--------------------------------
Laptop     ₹50,000       1
Mouse      ₹1,000        2
```

The system calculates:

```text
Laptop = 50,000 × 1 = 50,000
Mouse  =  1,000 × 2 =  2,000
--------------------------------
Subtotal              = 52,000
Discount              = Based on rules
Final Total           = Calculated amount
```

After the order is successfully created, the corresponding item stock is updated.

---

## 🔒 Security

Security-related practices used in the project include:

* JWT-based authentication
* Protected API endpoints
* Environment variables for sensitive configuration
* Password protection
* Server-side validation
* Stock validation before order creation

---

## 🎯 Key Learning Outcomes

This project demonstrates practical knowledge of:

* REST API development
* Node.js backend development
* Express.js
* MySQL database integration
* CRUD operations
* JWT authentication
* Middleware
* API authorization
* Inventory management
* Order processing
* Business-rule implementation
* Full-stack application development

---

## 📈 Future Improvements

Possible improvements include:

* [ ] Role-based access control
* [ ] Admin dashboard
* [ ] Order status tracking
* [ ] Pagination and filtering
* [ ] Search functionality
* [ ] Email notifications
* [ ] Payment gateway integration
* [ ] Docker support
* [ ] Automated unit and integration testing
* [ ] API documentation using Swagger/OpenAPI
* [ ] Deployment using AWS/Render/Railway

---

## 📸 Screenshots

Add screenshots of your application here:

```text
### Login
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Order Management
![Orders](screenshots/orders.png)
```

Screenshots make the GitHub repository much more attractive to recruiters.

---

## 👨‍💻 Author

**Maya Mandal**

GitHub:
https://github.com/mayamandal-matureDeveloper

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐.

---

## 📄 License

This project is developed for educational and demonstration purposes.
