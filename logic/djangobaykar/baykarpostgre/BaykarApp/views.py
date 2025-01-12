from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from BaykarApp.models import Employees, Teams, Production, Parts, Assembly, Aircrafts, InventoryAlerts
from BaykarApp.serializers import EmployeeAuthSerializer, TeamSerializer, EmployeeSerializer, ProductionSerializer, AssemblySerializer, InventoryAlertsSerializer, PartSerializer
from rest_framework import generics
from django.db import connection
from django.http import JsonResponse
from rest_framework.generics import ListAPIView

AIRCRAFT_REQUIREMENTS = {
    1: [  
        {"part_id": 1, "name": "AKINCI Kanat", "required_quantity": 4},
        {"part_id": 2, "name": "AKINCI Gövde", "required_quantity": 2},
        {"part_id": 3, "name": "AKINCI Kuyruk", "required_quantity": 2},
        {"part_id": 4, "name": "AKINCI Aviyonik", "required_quantity": 2},
    ],
    2: [  
        {"part_id": 5, "name": "TB2 Kanat", "required_quantity": 2},
        {"part_id": 6, "name": "TB2 Gövde", "required_quantity": 1},
        {"part_id": 7, "name": "TB2 Kuyruk", "required_quantity": 1},
        {"part_id": 8, "name": "TB2 Aviyonik", "required_quantity": 1},
    ],
    3: [  
        {"part_id": 9, "name": "TB3 Kanat", "required_quantity": 2},
        {"part_id": 10, "name": "TB3 Gövde", "required_quantity": 1},
        {"part_id": 11, "name": "TB3 Kuyruk", "required_quantity": 1},
        {"part_id": 12, "name": "TB3 Aviyonik", "required_quantity": 1},
    ],
    4: [  
        {"part_id": 13, "name": "KIZILELMA Kanat", "required_quantity": 2},
        {"part_id": 14, "name": "KIZILELMA Gövde", "required_quantity": 1},
        {"part_id": 15, "name": "KIZILELMA Kuyruk", "required_quantity": 1},
        {"part_id": 16, "name": "KIZILELMA Aviyonik", "required_quantity": 3},
    ],
}

class EmployeeLoginView(APIView):
    def post(self, request):
        serializer = EmployeeAuthSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.validated_data['employee']

            refresh = RefreshToken.for_user(employee)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'employee_id': employee.id,
                'team': employee.team.name,  
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Teams.objects.all()
    serializer_class = TeamSerializer


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Teams.objects.all()
    serializer_class = TeamSerializer


class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employees.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employees.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeTeamView(APIView):
    def get(self, request, employee_id):
        try:
            employee = Employees.objects.get(id=employee_id)
            team = employee.team
            return Response({
                "employee": {
                    "id": employee.id,
                    "first_name": employee.first_name,
                    "last_name": employee.last_name
                },
                "team": {
                    "id": team.id,
                    "name": team.name,
                    "responsible_id": team.responsible_part_id
                }
            })
        except Employees.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ProductionListCreateView(generics.ListCreateAPIView):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            team = Teams.objects.get(id=request.data['team'])
            part = Parts.objects.get(id=request.data['part'])
            if team.responsible_part_id != part.id:
                return Response(
                    {"error": "This team is not responsible for producing this part."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AssemblyListCreateView(generics.ListCreateAPIView):
    queryset = Assembly.objects.all()
    serializer_class = AssemblySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            part = Parts.objects.get(id=request.data['part'])
            aircraft = Aircrafts.objects.get(id=request.data['aircraft'])
            if part.aircraft_id != aircraft.id:
                return Response(
                    {"error": f"{part.name} parçası {aircraft.name} uçağına ait değildir."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class InventoryAlertsListView(generics.ListAPIView):
    queryset = InventoryAlerts.objects.all()
    serializer_class = InventoryAlertsSerializer

def employee_parts_view(request, employee_id):
    query = """
        SELECT 
            emp.first_name AS employee_name,
            emp.last_name AS employee_last,
            ac."name" AS aircraft_name,
            pr."name" AS part_name,
            pr.stock AS part_stock,
            te."name" AS team_name
        FROM employees emp
        INNER JOIN teams te ON emp.team_id = te.id
        INNER JOIN parts pr ON te.responsible_part_id = pr.id
        INNER JOIN aircrafts ac ON pr.aircraft_id = ac.id
        WHERE emp.id = %s
        ORDER BY ac."name", pr."name";
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [employee_id]) 
        rows = cursor.fetchall()

    data = [
        {
            "employee_name": row[0],
            "employee_last": row[1],
            "aircraft_name": row[2],
            "part_name": row[3],
            "part_stock": row[4],
            "team_name": row[5],
        }
        for row in rows
    ]

    return JsonResponse(data, safe=False)

class TeamPartsView(ListAPIView):
    serializer_class = PartSerializer

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        try:
            team = Teams.objects.get(id=team_id)
        except Teams.DoesNotExist:
            return Parts.objects.none()  

        return Parts.objects.filter(responsible_team=team)
    
class RecyclePartView(APIView):
    def post(self, request, *args, **kwargs):
        part_id = request.data.get("part_id")
        quantity = request.data.get("quantity")

        if not part_id or not quantity:
            return Response(
                {"error": "Parça ID'si ve miktar gereklidir."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            part = Parts.objects.get(id=part_id)

            if part.stock < quantity:
                return Response(
                    {"error": "Yeterli stok bulunmuyor."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            part.stock -= quantity

            if part.stock <= 0:
                part.delete()
                return Response(
                    {"message": f"Parça tamamen geri dönüştürüldü: {part.name}"},
                    status=status.HTTP_200_OK
                )

            part.save()
            return Response(
                {"message": f"{quantity} adet parça geri dönüştürüldü.", "part": PartSerializer(part).data},
                status=status.HTTP_200_OK
            )

        except Parts.DoesNotExist:
            return Response(
                {"error": "Parça bulunamadı."},
                status=status.HTTP_404_NOT_FOUND
            )
        
    
class AircraftProductionView(APIView):
    def post(self, request, aircraft_id):
        try:
            required_parts = AIRCRAFT_REQUIREMENTS.get(aircraft_id)
            if not required_parts:
                return Response({"error": "Invalid aircraft ID."}, status=status.HTTP_400_BAD_REQUEST)

            insufficient_parts = []
            for part in required_parts:
                db_part = Parts.objects.get(id=part["part_id"])
                if db_part.stock < part["required_quantity"]:
                    insufficient_parts.append(
                        {
                            "part_id": db_part.id,
                            "name": db_part.name,
                            "available": db_part.stock,
                            "required": part["required_quantity"],
                        }
                    )

            if insufficient_parts:
                return Response(
                    {
                        "error": "Insufficient stock for the following parts.",
                        "details": insufficient_parts,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for part in required_parts:
                db_part = Parts.objects.get(id=part["part_id"])
                db_part.stock -= part["required_quantity"]
                db_part.save()

            aircraft = Aircrafts.objects.get(id=aircraft_id)
            production = Production.objects.create(aircraft=aircraft, quantity=1)

            serializer = ProductionSerializer(production)
            return Response(
                {"message": f"{aircraft.name} successfully produced!", "production": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        except Parts.DoesNotExist:
            return Response({"error": "Part not found."}, status=status.HTTP_404_NOT_FOUND)
        except Aircrafts.DoesNotExist:
            return Response({"error": "Aircraft not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReduceStockView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            part_id = request.data.get('part_id')  
            part = Parts.objects.get(id=part_id)
            
            if part.stock > 0:
                part.stock -= 1
                part.save()
                return Response({"message": f"Stock updated. New stock: {part.stock}"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Stock cannot be reduced below zero."}, status=status.HTTP_400_BAD_REQUEST)
        except Parts.DoesNotExist:
            return Response({"error": "Part not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AssembleAircraftView(APIView):
    def post(self, request, aircraft_id):
        required_parts = AIRCRAFT_REQUIREMENTS.get(aircraft_id, [])
        used_parts = []

        for part in required_parts:
            part_instance = Parts.objects.get(id=part["part_id"])
            if part_instance.stock < part["required_quantity"]:
                return Response(
                    {"error": f"Yetersiz stok: {part_instance.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            part_instance.stock -= part["required_quantity"]
            part_instance.save()

            used_parts.append({
                "part_name": part_instance.name,
                "used_quantity": part["required_quantity"]
            })

        return Response({
            "message": f"Aircraft ID {aircraft_id} başarıyla monte edildi.",
            "used_parts": used_parts
        })
class ProducedAircraftsView(APIView):
    def get(self, request):
        productions = Production.objects.select_related('part__aircraft').all()
        aircrafts = {}

        for production in productions:
            aircraft = production.part.aircraft
            if aircraft.id not in aircrafts:
                aircrafts[aircraft.id] = {
                    "aircraft_name": aircraft.name,
                    "used_parts": []
                }
            aircrafts[aircraft.id]["used_parts"].append({
                "part_name": production.part.name,
                "used_quantity": production.quantity
            })

        return Response(aircrafts)

class MissingPartsView(APIView):
    def get(self, request, aircraft_id):
        required_parts = AIRCRAFT_REQUIREMENTS.get(aircraft_id, [])
        missing_parts = []

        for part in required_parts:
            part_instance = Parts.objects.get(id=part["part_id"])
            if part_instance.stock < part["required_quantity"]:
                missing_parts.append({
                    "part_name": part_instance.name,
                    "required_quantity": part["required_quantity"],
                    "available_quantity": part_instance.stock
                })

        if missing_parts:
            return Response({"error": "Eksik parçalar var!", "missing_parts": missing_parts}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Tüm parçalar mevcut ve montaj yapılabilir."})
def get_team_members_by_employee_id(request, employee_id):
    """
    Belirtilen employee_id'nin takım arkadaşlarını listeleyen bir endpoint.
    """
    query = """
        SELECT 
            emp.id AS employee_id,
            emp.first_name,
            emp.last_name,
            te.name AS team_name
        FROM 
            employees emp
        INNER JOIN 
            teams te ON emp.team_id = te.id
        WHERE 
            emp.team_id = (
                SELECT team_id 
                FROM employees 
                WHERE id = %s
            );
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [employee_id]) 
        rows = cursor.fetchall()

    team_members = [
        {
            "employee_id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "team_name": row[3]
        }
        for row in rows
    ]

    return JsonResponse(team_members, safe=False)
class TeamMembersView(APIView):
    def get(self, request, employee_id):
        try:
            employee = Employees.objects.get(id=employee_id)
            team_id = employee.team_id

            team_members = Employees.objects.filter(team_id=team_id)

            serializer = EmployeeSerializer(team_members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employees.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)