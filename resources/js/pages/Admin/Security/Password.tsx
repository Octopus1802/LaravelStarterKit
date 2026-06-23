import { useForm } from '@inertiajs/react';
import { Save, CheckCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface SecuritySettings {
    id: number;
    password_min_length: number;
    password_require_uppercase: boolean;
    password_require_numeric: boolean;
    password_require_special: boolean;
    password_max_age_days: number;
    password_history_count: number;
    password_ban_common: boolean;
}

interface Props {
    settings: SecuritySettings;
}

export default function Password({ settings }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        password_min_length: settings.password_min_length,
        password_require_uppercase: settings.password_require_uppercase,
        password_require_numeric: settings.password_require_numeric,
        password_require_special: settings.password_require_special,
        password_max_age_days: settings.password_max_age_days,
        password_history_count: settings.password_history_count,
        password_ban_common: settings.password_ban_common,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/security/password');
    };

    return (
        <div className="p-8 space-y-6 max-w-full mx-auto w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Complexity */}
                <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
                    <CardHeader className="border-b border-border/30 bg-muted/10">
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" /> Complexity Requirements
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Minimum character rules enforced at registration and password change.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2 max-w-xs">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                Minimum Length (chars)
                            </label>
                            <Input
                                type="number"
                                value={data.password_min_length}
                                onChange={(e) => setData('password_min_length', parseInt(e.target.value))}
                                min="8" max="64"
                                className="h-10 bg-card border-border/80 rounded-lg"
                                required
                            />
                            {errors.password_min_length && <p className="text-xs text-destructive">{errors.password_min_length}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {[
                                { key: 'password_require_uppercase' as const, label: 'Require Uppercase Letters (A–Z)' },
                                { key: 'password_require_numeric' as const, label: 'Require Numbers (0–9)' },
                                { key: 'password_require_special' as const, label: 'Require Special Characters (!@#$…)' },
                                { key: 'password_ban_common' as const, label: 'Block Known / Breached Passwords' },
                            ].map(({ key, label }) => (
                                <div key={key} className="flex items-center space-x-3 group cursor-pointer">
                                    <Checkbox
                                        id={key}
                                        checked={data[key]}
                                        onCheckedChange={(v) => setData(key, !!v)}
                                        className="rounded border-border/90 data-[state=checked]:bg-primary"
                                    />
                                    <label htmlFor={key} className="text-sm font-medium text-foreground/80 group-hover:text-foreground cursor-pointer select-none leading-none">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Rotation */}
                <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
                    <CardHeader className="border-b border-border/30 bg-muted/10">
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-muted-foreground" /> Password Rotation
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Force periodic password changes and prevent reuse.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                    Max Password Age (days)
                                </label>
                                <Input
                                    type="number"
                                    value={data.password_max_age_days}
                                    onChange={(e) => setData('password_max_age_days', parseInt(e.target.value))}
                                    min="1" max="365"
                                    className="h-10 bg-card border-border/80 rounded-lg"
                                    required
                                />
                                {errors.password_max_age_days && <p className="text-xs text-destructive">{errors.password_max_age_days}</p>}
                                <p className="text-[11px] text-muted-foreground">Users must change password every N days.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                    Password History (last N blocked)
                                </label>
                                <Input
                                    type="number"
                                    value={data.password_history_count}
                                    onChange={(e) => setData('password_history_count', parseInt(e.target.value))}
                                    min="0" max="24"
                                    className="h-10 bg-card border-border/80 rounded-lg"
                                    required
                                />
                                {errors.password_history_count && <p className="text-xs text-destructive">{errors.password_history_count}</p>}
                                <p className="text-[11px] text-muted-foreground">0 = disabled.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing} className="h-10 px-6 shadow-sm rounded-lg flex items-center gap-2">
                        <Save className="h-4 w-4" /> Save Password Policy
                    </Button>
                    {recentlySuccessful && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                            <CheckCircle className="h-4 w-4" /> Saved successfully!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
