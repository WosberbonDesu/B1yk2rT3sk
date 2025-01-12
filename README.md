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

### Project setup with Docker
✅ Implemented: The project can be set up and run using Docker, ensuring consistent development environments.

### Well-prepared documentation and comments
✅ Implemented: Comprehensive documentation is provided, including comments for better code understanding and a detailed README file.

### Unit tests
✅ implemented: Unit tests created in this project.

### Using DataTables for listing pages
❌ Not implemented: DataTables library is not used for list pages.

### Server-side DataTables
❌ Not implemented: Server-side integration with DataTables has not been applied.

### Asynchronous operations in the front end (Ajax, fetch, etc.)
✅ Implemented: Asynchronous operations are extensively used in the front end with Ajax requests.

### Relational tables managed separately
✅ Implemented: Relational tables are appropriately designed and managed in the database.

### Use of additional Django libraries
✅ Implemented: Extra Django libraries like drf-yasg (for Swagger documentation) are integrated.

### Front-end libraries/frameworks (Bootstrap, Tailwind, JQuery, etc.)
✅ Implemented: Tailwind CSS and JQuery are used for styling and asynchronous requests in the front end.

### API documentation (Swagger)
❌ Not implemented: Swagger-based API documentation is integrated and accessible.
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
Authenticate employees and return their employee ID, team information, and JWT token.

### Teams
- **`GET /api/teams/`**  
Fetch a list of all teams.
- **`POST /api/teams/`**  
Create a new team.
- **`GET /api/teams/<int:pk>/`** 
Retrieve detailed information about a specific team.
- **`GET /api/teams/<int:team_id>/parts/`**
List parts that a specific team is responsible for.

### Employees
- **`GET /api/employees/`**
Fetch a list of all employees.
- **`POST /api/employees/`**
Add a new employee.
- **`GET /api/employees/<int:pk>/`**
Retrieve detailed information about a specific employee.
- **`GET /employee-parts/<int:employee_id>/`**
List parts and aircraft assigned to the employee's team.

### Production
- **`GET /api/production/`**
Fetch all production records.
- **`POST /api/production/`**
Add a production record for a specific team and part.

### Assembly
- **`GET /api/assembly/`**
List all assembly operations.
- **`POST /api/assembly/`**
Record a new assembly operation for a specific part and aircraft.

### Inventory Alerts
- **`GET /api/inventory-alerts/`**
Fetch a list of inventory alerts, including missing parts and their quantities.

### Recycling Parts
- **`POST /api/parts/recycle/`**
Recycle a part and adjust its stock.

### Aircraft Production
- **`GET /api/aircrafts/<int:aircraft_id>/production/`**
Fetch the parts required for the production of a specific aircraft.

### Reduce Stock
- **`POST /api/parts/reduce-stock/`**
Reduce the stock of a part by a specified amount.

### Aircraft Assembly
- **`POST /api/aircrafts/<int:aircraft_id>/assemble/`**
Assemble an aircraft by combining all required parts, updating inventory, and recording the assembly.

### Produced Aircrafts
- **`GET /api/produced-aircrafts/`**
List all produced aircraft, along with their used parts and quantities.

### Missing Parts
- **`GET /api/aircrafts/<int:aircraft_id>/missing-parts/`**
Check for missing parts required for assembling a specific aircraft.

### Team Members
- **`GET /api/team-members/<int:employee_id>/`**
Fetch all team members who belong to the same team as the given employee.
