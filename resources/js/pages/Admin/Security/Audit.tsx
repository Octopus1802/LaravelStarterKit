import React from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Terminal, Save, CheckCircle, Bell, AlertTriangle } from 'lucide-react';

interface SecuritySettings {
    id: number;
    audit_log_retention_days: number;
    log_failed_logins: boolean;
    log_permission_changes: boolean;
    notify_admin_on_breach: boolean;
    notify_admin_email: string | null;
}

interface AuditLog {
    id: number;
    event: string;
    description: string;
    user: string;
    ip: string;
    created_at: string;
}

interface Props {
    settings: SecuritySettings;
    auditLogs: AuditLog[];
}

export default function Audit({ settings, auditLogs }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        audit_log_retention_days: settings.audit_log_retention_days,
        log_failed_logins:        settings.log_failed_logins,
        log_permission_changes:   settings.log_permission_changes,
        notify_admin_on_breach:   settings.notify_admin_on_breach,
        notify_admin_email:       settings.notify_admin_email ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/security/audit');
    };

    return (
        <div className="p-8 space-y-6 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Settings Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
                            <CardHeader className="border-b border-border/30 bg-muted/10">
                                <CardTitle className="text-md font-bold flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-muted-foreground" /> Log Settings
                                </CardTitle>
                                <CardDescription className="text-xs">Choose what events to record.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Retain Logs (days)</label>
                                    <Input type="number" value={data.audit_log_retention_days}
                                        onChange={(e) => setData('audit_log_retention_days', parseInt(e.target.value))}
                                        min="30" max="3650" className="h-10 bg-card border-border/80 rounded-lg" required />
                                    {errors.audit_log_retention_days && <p className="text-xs text-destructive">{errors.audit_log_retention_days}</p>}
                                </div>

                                {[
                                    { key: 'log_failed_logins'      as const, label: 'Log Failed Login Attempts' },
                                    { key: 'log_permission_changes' as const, label: 'Log Role / Permission Changes' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center space-x-3 group cursor-pointer">
                                        <Checkbox id={key} checked={data[key]}
                                            onCheckedChange={(v) => setData(key, !!v)}
                                            className="rounded border-border/90 data-[state=checked]:bg-primary" />
                                        <label htmlFor={key} className="text-sm font-medium text-foreground/80 group-hover:text-foreground cursor-pointer select-none leading-none">
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
                            <CardHeader className="border-b border-border/30 bg-muted/10">
                                <CardTitle className="text-md font-bold flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-muted-foreground" /> Breach Notifications
                                </CardTitle>
                                <CardDescription className="text-xs">Send admin alerts on security events.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center space-x-3 group cursor-pointer">
                                    <Checkbox id="notify_admin" checked={data.notify_admin_on_breach}
                                        onCheckedChange={(v) => setData('notify_admin_on_breach', !!v)}
                                        className="rounded border-border/90 data-[state=checked]:bg-primary" />
                                    <label htmlFor="notify_admin" className="text-sm font-medium text-foreground/80 group-hover:text-foreground cursor-pointer select-none leading-none">
                                        Notify admin on suspicious events
                                    </label>
                                </div>

                                {data.notify_admin_on_breach && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Alert Email</label>
                                        <Input type="email" value={data.notify_admin_email}
                                            onChange={(e) => setData('notify_admin_email', e.target.value)}
                                            placeholder="admin@yourdomain.com"
                                            className="h-10 bg-card border-border/80 rounded-lg" />
                                        {errors.notify_admin_email && <p className="text-xs text-destructive">{errors.notify_admin_email}</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing} className="h-10 px-4 shadow-sm rounded-lg flex items-center gap-2">
                                <Save className="h-4 w-4" /> Save
                            </Button>
                            {recentlySuccessful && (
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                                    <CheckCircle className="h-4 w-4" /> Saved!
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Audit Log */}
                <div className="lg:col-span-2">
                    <Card className="border border-border/40 shadow-md bg-card/60 backdrop-blur-md overflow-hidden">
                        <CardHeader className="border-b border-border/30 bg-muted/10">
                            <CardTitle className="text-md font-bold flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-muted-foreground" /> Security Audit Log
                            </CardTitle>
                            <CardDescription className="text-xs">Live list of critical administrative events.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/20 hover:bg-transparent">
                                        <TableHead className="text-xs font-semibold">Event</TableHead>
                                        <TableHead className="text-xs font-semibold">Description</TableHead>
                                        <TableHead className="text-xs font-semibold">User / IP</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditLogs.map((log) => {
                                        const isAlert = log.event.toLowerCase().includes('failed') || log.event.toLowerCase().includes('blocked');
                                        return (
                                            <TableRow key={log.id} className="border-border/20 hover:bg-muted/10 text-xs">
                                                <TableCell>
                                                    <span className={`font-semibold px-2 py-0.5 rounded border ${
                                                        isAlert
                                                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                                                            : 'bg-muted border-border/60 text-foreground'
                                                    }`}>
                                                        {log.event}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-foreground/80 max-w-[160px] truncate">{log.description}</TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-[10px] space-y-0.5">
                                                        <div>{log.user}</div>
                                                        <div className="text-muted-foreground flex items-center gap-1">
                                                            <AlertTriangle className="h-3 w-3 shrink-0" /> {log.ip}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
