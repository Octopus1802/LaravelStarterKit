<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:roles,name']);
        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return back()->with('message', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        if ($role->name === 'Super-Admin') {
            return back()->with('error', 'The Super-Admin role cannot be modified.');
        }

        $request->validate(['name' => 'required|string|unique:roles,name,' . $role->id]);
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return back()->with('message', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Super-Admin') {
            return back()->with('error', 'The Super-Admin role cannot be deleted.');
        }

        $role->delete();
        return back()->with('message', 'Role deleted successfully.');
    }
}