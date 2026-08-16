import csv
from django.http import HttpResponse
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.action(description="Export Selected Users to Excel (CSV)")
def export_as_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="userdetails_excel_sheet.csv"'
    writer = csv.writer(response)
    writer.writerow(['Username', 'Email', 'Wallet Balance', 'Is Developer', 'Date Joined', 'Last Login'])
    for user in queryset:
        writer.writerow([user.username, user.email, user.wallet_balance, user.is_developer, user.date_joined, user.last_login])
    return response

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'wallet_balance', 'is_developer', 'is_staff']
    actions = [export_as_csv]
    fieldsets = UserAdmin.fieldsets + (
        ('Platform Details', {'fields': ('wallet_balance', 'is_developer')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Platform Details', {'fields': ('wallet_balance', 'is_developer')}),
    )

admin.site.register(User, CustomUserAdmin)
