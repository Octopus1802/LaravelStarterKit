import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Trash2, Edit3, Mail, Shield, ShieldCheck, Calendar, Info, X } from 'lucide-react';
import type { Auth } from '@/types';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles: Role[];
    created_at: string;
}

interface Props {
    users: User[];
    roles: Role[];
}

const getAvatarStyle = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [0, 30, 150, 200, 260, 320];
    const hue = hues[hash % hues.length];
    return {
        bg: `hsl(${hue}, 85%, 93%)`,
        text: `hsl(${hue}, 85%, 35%)`,
    };
};

export default function Index({ users, roles }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles.map((r) => r.name),
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        reset();
    };

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter((r) => r !== roleName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    setEditingUser(null);
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(`/admin/users/${id}`);
        }
    };

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.roles.some(r => r.name === 'Super-Admin')).length;

    return (
        <div className="p-8 space-y-8 max-w-full ">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text">
                        User Control Center
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Monitor active accounts, assign access profiles, and enforce organization boundaries.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-card border border-border/50 rounded-lg shadow-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{totalUsers} Total Users</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border/50 rounded-lg shadow-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-foreground">{adminCount} Admins</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Users List Table */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="border border-border/40 shadow-sm bg-card/50 backdrop-blur-md overflow-hidden">
                        <CardHeader className="border-b border-border/30 bg-muted/20 px-6 py-4">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground" /> Registered Accounts
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Eager loaded list of active platform users and roles.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow className="hover:bg-transparent border-b border-border/30">
                                        <TableHead className="w-[45%] pl-6">Profile & Identity</TableHead>
                                        <TableHead className="w-[30%]">Security Roles</TableHead>
                                        <TableHead className="w-[15%]">Created</TableHead>
                                        <TableHead className="w-[10%] pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => {
                                        const initials = user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase();
                                        const avatar = getAvatarStyle(user.name);

                                        return (
                                            <TableRow key={user.id} className="hover:bg-muted/30 border-b border-border/20 transition-all duration-200">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner shrink-0"
                                                            style={{
                                                                backgroundColor: avatar.bg,
                                                                color: avatar.text
                                                            }}
                                                        >
                                                            {initials}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                                                                {user.name}
                                                                {user.email_verified_at && (
                                                                    <span title="Email Verified" className="shrink-0">
                                                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
                                                                <Mail className="h-3 w-3 shrink-0 opacity-60" /> {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {user.roles.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground italic">No Roles assigned</span>
                                                        ) : (
                                                            user.roles.map((r) => {
                                                                const isSuper = r.name === 'Super-Admin';
                                                                const isManager = r.name === 'Manager';
                                                                return (
                                                                    <span
                                                                        key={r.id}
                                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 ${isSuper
                                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-inner'
                                                                            : isManager
                                                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                                                                : 'bg-muted text-muted-foreground border-border/80'
                                                                            }`}
                                                                    >
                                                                        <Shield className="h-3 w-3" />
                                                                        {r.name}
                                                                    </span>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground py-4">
                                                    <span className="flex items-center gap-1 text-xs">
                                                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(user)}
                                                            className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg"
                                                            title="Edit User"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Button>
                                                        {auth?.user?.id !== user.id ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(user.id)}
                                                                className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <div className="h-8 w-8 flex items-center justify-center opacity-40 text-xs text-muted-foreground select-none" title="You are logged in as this user">
                                                                Self
                                                            </div>
                                                        )}
                                                    </div>
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
                                <UserPlus className="h-5 w-5 text-muted-foreground" />
                                {editingUser ? 'Edit Identity Details' : 'Register New Identity'}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {editingUser ? 'Modify user accounts, credentials, and roles.' : 'Create a new user with targeted roles.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Jane Doe"
                                        className="h-10 pl-3 bg-card border-border/80 focus:border-primary/50 focus:ring-0 rounded-lg"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="jane@example.com"
                                        className="h-10 pl-3 bg-card border-border/80 focus:border-primary/50 focus:ring-0 rounded-lg"
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                        Security Credentials
                                    </label>
                                    <Input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={editingUser ? '••••••••' : 'Password (min. 8 chars)'}
                                        className="h-10 pl-3 bg-card border-border/80 focus:border-primary/50 focus:ring-0 rounded-lg"
                                        required={!editingUser}
                                    />
                                    {editingUser && (
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                            <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" /> Leave blank to retain current password.
                                        </p>
                                    )}
                                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Access Permissions Roles</label>
                                    <div className="border border-border/60 p-3.5 rounded-lg bg-muted/20 space-y-2.5 max-h-52 overflow-y-auto">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-3 group cursor-pointer">
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={data.roles.includes(role.name)}
                                                    onCheckedChange={(checked) => handleCheckboxChange(role.name, !!checked)}
                                                    className="rounded border-border/90 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                />
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-medium text-foreground/80 group-hover:text-foreground cursor-pointer select-none leading-none flex items-center gap-1.5"
                                                >
                                                    <Shield className="h-3.5 w-3.5 text-muted-foreground/60" />
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.roles && <p className="text-xs text-destructive">{errors.roles}</p>}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full h-10 shadow-sm rounded-lg hover:shadow transition-all duration-200">
                                        {editingUser ? 'Update Profile' : 'Register User'}
                                    </Button>
                                    {editingUser && (
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
