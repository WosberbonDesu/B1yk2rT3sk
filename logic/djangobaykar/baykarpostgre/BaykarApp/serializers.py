from rest_framework import serializers
from BaykarApp.models import Employees, Teams, Production, Assembly, InventoryAlerts, Parts

class EmployeeAuthSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)

    def validate(self, data):
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        try:
            employee = Employees.objects.get(first_name=first_name, last_name=last_name)
            return {'employee': employee}
        except Employees.DoesNotExist:
            raise serializers.ValidationError("Ad veya soyad hatalı.")
        
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teams
        fields = ['id', 'name', 'responsible_part_id']

class EmployeeSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Employees
        fields = ['id', 'first_name', 'last_name', 'team', 'team_name']
        
class ProductionSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    part_name = serializers.CharField(source='part.name', read_only=True)

    class Meta:
        model = Production
        fields = ['id', 'team', 'team_name', 'part', 'part_name', 'quantity', 'created_at']

    def validate(self, data):
        team = data.get('team')
        part = data.get('part')

        if team.responsible_part_id != part.id:
            raise serializers.ValidationError("This team is not responsible for producing this part.")

        return data
    
class AssemblySerializer(serializers.ModelSerializer):
    aircraft_name = serializers.CharField(source='aircraft.name', read_only=True)
    part_name = serializers.CharField(source='part.name', read_only=True)

    class Meta:
        model = Assembly
        fields = ['id', 'aircraft', 'aircraft_name', 'part', 'part_name', 'quantity', 'created_at']

    def validate(self, data):
        aircraft = data.get('aircraft')
        part = data.get('part')

        if part.aircraft_id != aircraft.id:
            raise serializers.ValidationError(
                f"{part.name} parçası {aircraft.name} uçağına ait değildir."
            )

        return data
    
class InventoryAlertsSerializer(serializers.ModelSerializer):
    part_name = serializers.CharField(source='part.name', read_only=True)

    class Meta:
        model = InventoryAlerts
        fields = ['id', 'part', 'part_name', 'missing_quantity', 'created_at']



class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parts
        fields = ['id', 'name', 'stock', 'aircraft']