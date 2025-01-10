# Baykar Production Management System

This project is a **Production Management System** designed for managing parts production, assembly, and inventory alerts for teams and employees. It provides APIs for authentication, CRUD operations, and monitoring production workflows.

---

## Features
- **Employee Management**: Add, update, delete, and retrieve employees and their teams.
- **Production Management**: Create, list, and manage parts production by teams.
- **Assembly Management**: Manage and track the assembly of aircraft parts.
- **Inventory Alerts**: Monitor missing parts in the inventory.
- **Authentication**: Secure login system for employees.
- **Parts Recycling**: Recycle and adjust stock for unused parts.

---

## Technologies Used
- **Backend**: Django REST Framework
- **Frontend**: HTML, Tailwind CSS, JavaScript (jQuery)
- **Database**: PostgreSQL

---

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL
- Html, Tailwind, Javascript (for frontend development, optional)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/baykar-production-management.git
   ```
2. Navigate to the project directory:
   ```bash
   cd baykar-production-management
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Install dependencies:
   ```bash
   Apply database migrations:
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- **`POST /api/login/`**  
  Authenticate employees and return a JWT token along with employee and team information.

### Teams
- **`GET /api/teams/`**  
  Fetch a list of all teams.  
- **`POST /api/teams/`**  
  Create a new team.  
- **`GET /api/teams/<int:pk>/`**  
  Retrieve a specific team's details.  
- **`GET /api/teams/<int:team_id>/parts/`**  
  List parts responsible for a specific team.  

### Employees
- **`GET /api/employees/`**  
  List all employees.  
- **`POST /api/employees/`**  
  Add a new employee.  
- **`GET /api/employees/<int:pk>/`**  
  Retrieve a specific employee's details.  
- **`GET /employee-parts/<int:employee_id>/`**  
  List all parts and aircraft assigned to the employee's team.  

### Production
- **`GET /api/production/`**  
  List all production records.  
- **`POST /api/production/`**  
  Add a new production record for a specific team and part.  

### Assembly
- **`GET /api/assembly/`**  
  List all assembly operations.  
- **`POST /api/assembly/`**  
  Record a new assembly operation.  

### Inventory Alerts
- **`GET /api/inventory-alerts/`**  
  List all missing parts and their quantities.  

### Parts Recycling
- **`POST /api/parts/recycle/`**  
  Recycle a part and adjust its stock.  
