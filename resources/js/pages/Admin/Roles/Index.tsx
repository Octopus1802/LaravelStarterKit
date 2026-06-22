import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, ShieldAlert, Key, Plus, Trash2, Edit3, Lock, Check, X, Info } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function Index({ roles, permissions }: Props) {
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
        });
    };

    const handleCancel = () => {
        setEditingRole(null);
        reset();
    };

    const handleCheckboxChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            put(`/roles/${editingRole.id}`, {
                onSuccess: () => { setEditingRole(null); reset(); }
            });
        } else {
            post('/roles', {
                onSuccess: () => reset()
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            destroy(`/roles/${id}`);
        }
    };

    const totalRoles = roles.length;
    const totalPermissions = permissions.length;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text">
                        Role Security Console
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Define high-level authorization roles and map security capabilities directly to access keys.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-card border border-border/50 rounded-lg shadow-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{totalRoles} Roles</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border/50 rounded-lg shadow-sm flex items-center gap-2">
                        <Key className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-foreground">{totalPermissions} Capabilities</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Roles Table */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="border border-border/40 shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
                        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-4">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-muted-foreground" /> Security Profiles
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Manage role permissions. System roles govern access control parameters.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow className="hover:bg-transparent border-b border-border/30">
                                        <TableHead className="w-[30%] pl-6">Role Profile</TableHead>
                                        <TableHead className="w-[55%]">Active System Permissions</TableHead>
                                        <TableHead className="w-[15%] pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => {
                                        const isSuperAdmin = role.name === 'Super-Admin';
                                        const isManager = role.name === 'Manager';

                                        return (
                                            <TableRow key={role.id} className="hover:bg-muted/30 border-b border-border/20 transition-all duration-200">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded-lg border ${
                                                            isSuperAdmin 
                                                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                                                                : isManager
                                                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                                                                : 'bg-muted border-border text-muted-foreground'
                                                        }`}>
                                                            <Shield className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-semibold text-foreground">{role.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {isSuperAdmin ? (
                                                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                                <Lock className="h-3 w-3" /> All Capabilities (Bypassed)
                                                            </span>
                                                        ) : role.permissions.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground italic">No Permissions mapped</span>
                                                        ) : (
                                                            role.permissions.map(p => (
                                                                <span 
                                                                    key={p.id} 
                                                                    className="bg-muted text-muted-foreground border border-border/80 text-xs px-2.5 py-0.5 rounded-full font-medium"
                                                                >
                                                                    {p.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    {isSuperAdmin ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold px-3 py-1 opacity-60">
                                                            <Lock className="h-3.5 w-3.5" /> Immutable
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                onClick={() => handleEdit(role)}
                                                                className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg"
                                                                title="Edit Role"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(role.id)}
                                                                className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg"
                                                                title="Delete Role"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Card Panel */}
                <div className="sticky top-6">
                    <Card className="border border-border/40 shadow-md bg-card/60 backdrop-blur-md">
                        <CardHeader className="border-b border-border/30 bg-muted/10">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <Plus className="h-5 w-5 text-muted-foreground" />
                                {editingRole ? 'Edit Security Role' : 'Create Security Role'}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {editingRole ? 'Modify role title and associated capabilities.' : 'Register a new role key mapping.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Role Title</label>
                                    <Input 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="e.g. Editor, Moderator"
                                        className="h-10 pl-3 bg-card border-border/80 focus:border-primary/50 focus:ring-0 rounded-lg"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Map Permissions Capabilities</label>
                                    <div className="border border-border/60 p-3.5 rounded-lg bg-muted/20 space-y-2.5 max-h-60 overflow-y-auto">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-3 group cursor-pointer">
                                                <Checkbox 
                                                    id={`perm-${permission.id}`}
                                                    checked={data.permissions.includes(permission.name)}
                                                    onCheckedChange={(checked) => handleCheckboxChange(permission.name, !!checked)}
                                                    className="rounded border-border/90 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                />
                                                <label 
                                                    htmlFor={`perm-${permission.id}`} 
                                                    className="text-sm font-medium text-foreground/80 group-hover:text-foreground cursor-pointer select-none leading-none flex items-center gap-1.5"
                                                >
                                                    <Key className="h-3.5 w-3.5 text-muted-foreground/60" />
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.permissions && <p className="text-xs text-destructive">{errors.permissions}</p>}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full h-10 shadow-sm rounded-lg hover:shadow transition-all duration-200">
                                        {editingRole ? 'Update Profile' : 'Create Role'}
                                    </Button>
                                    {editingRole && (
                                        <Button type="button" variant="ghost" onClick={handleCancel} className="h-10 hover:bg-muted border border-border/40 rounded-lg">
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}