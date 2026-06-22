import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Key, Shield, UserCheck, Users, Terminal,
    AlertTriangle, ChevronRight, CheckCircle, XCircle,
} from 'lucide-react';

interface SecuritySettings {
    id: number;
    password_min_length: number;
    password_require_uppercase: boolean;
    password_require_numeric: boolean;
    password_require_special: boolean;
    password_ban_common: boolean;
    password_max_age_days: number;
    login_max_attempts: number;
    lockout_duration_minutes: number;
    session_lifetime_minutes: number;
    idle_timeout_minutes: number;
    enforce_mfa_admins: boolean;
    enforce_mfa_all_users: boolean;
    registration_enabled: boolean;
    require_email_verification: boolean;
    force_https: boolean;
    notify_admin_on_breach: boolean;
    audit_log_retention_days: number;
}

interface AuditLog {
    id: number;
    event: string;
    description: string;
    user: string;
    ip: string;
    created_at: string;
}

import { Pagination, LinkItem } from '@/components/Pagination';

interface Props {
    settings: SecuritySettings;
    auditLogs: {
        data: AuditLog[];
        links: LinkItem[];
        from: number | null;
        to: number | null;
        total: number;
    };
}



function StatusBadge({ value }: { value: boolean }) {
    return value ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" /> Enabled
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <XCircle className="h-3 w-3" /> Disabled
        </span>
    );
}

const sections = [
    {
        title: 'Password Policy',
        href: '/admin/security/password',
        icon: Key,
        color: 'text-rose-500 dark:text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        description: 'Complexity, rotation & breach protection rules.',
        getStats: (s: SecuritySettings) => [
            { label: 'Min Length', value: `${s.password_min_length} chars` },
            { label: 'Uppercase', value: <StatusBadge value={s.password_require_uppercase} /> },
            { label: 'Numbers', value: <StatusBadge value={s.password_require_numeric} /> },
            { label: 'Special', value: <StatusBadge value={s.password_require_special} /> },
            { label: 'Ban Common', value: <StatusBadge value={s.password_ban_common} /> },
            { label: 'Max Age', value: `${s.password_max_age_days} days` },
        ],
    },
    {
        title: 'Sessions & Lockout',
        href: '/admin/security/sessions',
        icon: Shield,
        color: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        description: 'Brute force protection, session lifetime & device rules.',
        getStats: (s: SecuritySettings) => [
            { label: 'Max Attempts', value: `${s.login_max_attempts} tries` },
            { label: 'Lockout Duration', value: `${s.lockout_duration_minutes} min` },
            { label: 'Session Lifetime', value: `${s.session_lifetime_minutes} min` },
            { label: 'Idle Timeout', value: `${s.idle_timeout_minutes} min` },
        ],
    },
    {
        title: 'MFA & Access Control',
        href: '/admin/security/access',
        icon: UserCheck,
        color: 'text-violet-500 dark:text-violet-400',
        bg: 'bg-violet-500/10 border-violet-500/20',
        description: 'Multi-factor auth, IP filtering & network controls.',
        getStats: (s: SecuritySettings) => [
            { label: 'MFA (Admins)', value: <StatusBadge value={s.enforce_mfa_admins} /> },
            { label: 'MFA (All)', value: <StatusBadge value={s.enforce_mfa_all_users} /> },
            { label: 'Force HTTPS', value: <StatusBadge value={s.force_https} /> },
        ],
    },
    {
        title: 'Account Lifecycle',
        href: '/admin/security/accounts',
        icon: Users,
        color: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        description: 'Registration, verification & inactivity policies.',
        getStats: (s: SecuritySettings) => [
            { label: 'Registration', value: <StatusBadge value={s.registration_enabled} /> },
            { label: 'Email Verification', value: <StatusBadge value={s.require_email_verification} /> },
        ],
    },
    {
        title: 'Audit & Alerts',
        href: '/admin/security/audit',
        icon: Terminal,
        color: 'text-sky-500 dark:text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/20',
        description: 'Log retention, event tracking & breach notifications.',
        getStats: (s: SecuritySettings) => [
            { label: 'Log Retention', value: `${s.audit_log_retention_days} days` },
            { label: 'Breach Alerts', value: <StatusBadge value={s.notify_admin_on_breach} /> },
        ],
    },
];

export default function Index({ settings, auditLogs }: Props) {
    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto w-full">
            {/* Section Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href} className="group">
                        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md hover:shadow-md hover:border-border/80 transition-all duration-200 h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-semibold ${section.bg} ${section.color}`}>
                                        <section.icon className="h-3.5 w-3.5" />
                                        {section.title}
                                    </div>
                                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 ${section.color}`} />
                                </div>
                                <CardDescription className="text-xs pt-1">{section.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {section.getStats(settings).map((stat) => (
                                        <div key={stat.label} className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">{stat.label}</span>
                                            <span className="font-semibold text-foreground/90">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Audit Log */}
            <Card className="border border-border/40 shadow-md bg-card/60 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-border/30 bg-muted/10 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-muted-foreground" /> Recent Security Events
                        </CardTitle>
                        <CardDescription className="text-xs">Paginated list of critical platform events. Go to Audit & Alerts for the full log.</CardDescription>
                    </div>
                    <Link href="/admin/security/audit" className="text-xs text-primary hover:underline flex items-center gap-1">
                        View all & settings <ChevronRight className="h-3 w-3" />
                    </Link>
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
                            {auditLogs.data.map((log) => {
                                const isAlert = log.event.toLowerCase().includes('failed') || log.event.toLowerCase().includes('blocked');
                                return (
                                    <TableRow key={log.id} className="border-border/20 hover:bg-muted/10 text-xs">
                                        <TableCell>
                                            <span className={`font-semibold px-2 py-0.5 rounded border ${isAlert
                                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                                                : 'bg-muted border-border/60 text-foreground'
                                                }`}>
                                                {log.event}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-foreground/80 max-w-[240px] truncate">{log.description}</TableCell>
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
                    <Pagination
                        links={auditLogs.links}
                        from={auditLogs.from}
                        to={auditLogs.to}
                        total={auditLogs.total}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
