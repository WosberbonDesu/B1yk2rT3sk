from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from BaykarApp.models import Parts, InventoryAlerts,Employees, Teams, Parts, Production

class InventoryAlertsAPITest(TestCase):

    def setUp(self):
        # Test verilerini oluştur
        part1 = Parts.objects.create(name="TB2 Kuyruk", stock=20)
        part2 = Parts.objects.create(name="TB3 Kanat", stock=10)

        InventoryAlerts.objects.create(part=part1, missing_quantity=5)
        InventoryAlerts.objects.create(part=part2, missing_quantity=15)

        self.client = APIClient()

    def test_inventory_alerts_list(self):
        response = self.client.get('/api/inventory-alerts/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 2)  

        self.assertEqual(response.data[0]['part_name'], "TB2 Kuyruk")
        self.assertEqual(response.data[0]['missing_quantity'], 5)
        
class ProductionAPITest(TestCase):
    def setUp(self):
        team1 = Teams.objects.create(name="Kanat Takımı")
        part1 = Parts.objects.create(name="Kanat", stock=50)
        self.production_data = {
            "team": team1.id,
            "part": part1.id,
            "quantity": 10
        }
        self.client = APIClient()

    def test_create_production(self):
        response = self.client.post('/api/production/', self.production_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        production = Production.objects.get(id=response.data['id'])
        self.assertEqual(production.quantity, 10)

    def test_list_production(self):
        team = Teams.objects.create(name="Gövde Takımı")
        part = Parts.objects.create(name="Gövde", stock=30)
        Production.objects.create(team=team, part=part, quantity=5)

        response = self.client.get('/api/production/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['team'], team.id)


class EmployeeAPITest(TestCase):
    def setUp(self):
        team = Teams.objects.create(name="Aviyonik Takımı")
        self.employee = Employees.objects.create(first_name="Ali", last_name="Yılmaz", team=team)
        self.client = APIClient()

    def test_employee_team(self):
        response = self.client.get(f'/api/employees/{self.employee.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['first_name'], "Ali")
        self.assertEqual(response.data['team'], self.employee.team.id)