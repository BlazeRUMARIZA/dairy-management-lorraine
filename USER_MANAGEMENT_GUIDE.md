# User Management - Quick Usage Guide

## 🎯 How to Use User Management

### Prerequisites
- Must be logged in as **Admin** user
- Navigate to: **Settings → Users tab**

## 📋 Available Operations

### 1. View All Users
- The users list loads automatically when you open the Users tab
- Shows: Name, Email, Role, Status
- Fetched from: `GET /api/v1/users`

### 2. Create New User
1. Click **"Add Employee"** button
2. Fill in the form:
   - Name (required)
   - Email (required, must be unique)
   - Password (required)
   - Role (admin/manager/operator/driver/viewer)
3. Click **"Create Employee"**
4. ✅ User credentials are displayed - share with the new user
5. New user can login immediately

### 3. Update User ⭐ (FIXED)
1. Click **Edit** icon next to user
2. Modify:
   - Name
   - Email (must be unique)
   - Role
3. Click **"Update Employee"**
4. ✅ Changes are saved to database
5. Changes reflect immediately in the list

**Note:** Password cannot be changed here - users must use "Change Password" in their account settings

### 4. Delete User
1. Click **Delete** icon next to user
2. Confirm deletion
3. ✅ User is permanently removed
4. **Cannot delete yourself**

### 5. View User Details
- Click on user name to view full details
- Shows: All user information, last login, created date

## 🔒 Role Permissions

### Admin
- ✅ Can manage all users
- ✅ Can create/update/delete users
- ✅ Can change user roles
- ❌ Cannot delete/deactivate themselves

### Manager, Operator, Driver, Viewer
- ❌ Cannot access user management
- ✅ Can update their own profile via Settings

## ⚠️ Important Notes

1. **Email Uniqueness** - Each email must be unique
2. **Self-Protection** - Admins cannot delete or deactivate their own account
3. **Password Security** - Passwords are not shown after creation
4. **Role Changes** - Take effect on next login
5. **Status Changes** - Inactive users cannot login

## 🔧 Troubleshooting

### "Failed to load users"
- Check internet connection
- Verify you're logged in as admin
- Check backend is running

### "Failed to update user"
- Check email is unique
- Ensure all required fields are filled
- Verify admin permissions

### "Failed to delete user"
- Cannot delete yourself
- Check admin permissions
- Ensure user exists

## 📊 Example Workflow

### Adding a New Manager
```
1. Settings → Users → Add Employee
2. Fill form:
   Name: Jane Smith
   Email: jane@dairy.com
   Password: SecurePass123!
   Role: manager
3. Click "Create Employee"
4. Share credentials with Jane
5. Jane can login and access manager features
```

### Updating User Role
```
1. Find user in list
2. Click Edit icon
3. Change Role: operator → manager
4. Click "Update Employee"
5. User gets new permissions on next login
```

## 🎉 What's New (Fixed)

✅ **Update functionality now works!**
- Before: Updates only changed local display
- After: Updates persist to database
- Changes are permanent and survive page refresh

✅ **Real-time synchronization**
- Backend API calls for all operations
- No more mock data
- Production-ready implementation

---

**Need Help?** Check `USER_MANAGEMENT_FIX.md` for technical details.
