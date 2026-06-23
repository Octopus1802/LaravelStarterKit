import { Link, usePage } from '@inertiajs/react';
import { Shield, Key, Fingerprint, Lock } from 'lucide-react';

import AppLogoDynamic from '@/components/app-logo-dynamic';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {

    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-6 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden bg-background">
            {/* Custom Animations Style Tag */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes rotate-cw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotate-ccw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes float-blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.15); }
                    66% { transform: translate(-30px, 20px) scale(0.9); }
                }
                @keyframes float-blob-reverse {
                    0%, 100% { transform: translate(0px, 0px) scale(1.1); }
                    50% { transform: translate(-45px, 45px) scale(0.95); }
                }
                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
                .animate-rotate-cw {
                    animation: rotate-cw 25s infinite linear;
                }
                .animate-rotate-ccw {
                    animation: rotate-ccw 20s infinite linear;
                }
                .animate-blob-1 {
                    animation: float-blob 18s infinite ease-in-out;
                }
                .animate-blob-2 {
                    animation: float-blob-reverse 22s infinite ease-in-out;
                }
                .animate-pulse-soft {
                    animation: pulse-soft 4s infinite ease-in-out;
                }
            `}} />

            {/* Left Column: Visual Security Branding (Desktop Only) */}
            <div className="relative hidden h-full flex-col justify-between p-10 text-white lg:flex overflow-hidden border-r border-border/40 bg-zinc-950">
                {/* Mesh Gradient Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-600/20 blur-[90px] animate-blob-1 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-rose-600/15 blur-[120px] animate-blob-2 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_90%)] pointer-events-none" />

                {/* Tech Grid Background pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* Logo & Brand Header */}
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
                        <AppLogoDynamic className="size-5 object-contain" iconClassName="size-5 fill-current text-white" />
                    </div>
                    <span className="font-semibold text-white/90">{name}</span>
                </Link>

                {/* Center Graphic: Pulsing Security Ring Visual */}
                <div className="relative z-20 flex flex-col items-center justify-center py-12 flex-1">
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        {/* Outer Orbit Ring */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/20 animate-rotate-cw" />

                        {/* Middle Orbit Ring */}
                        <div className="absolute inset-6 rounded-full border border-indigo-400/10" />
                        <div className="absolute inset-6 rounded-full border-t border-r border-rose-500/20 animate-rotate-ccw" />

                        {/* Inner Glowing Ring */}
                        <div className="absolute inset-14 rounded-full border border-white/10 bg-indigo-950/20 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center">
                            {/* Animated Scanner Ring */}
                            <div className="absolute inset-1 rounded-full border border-indigo-500/30 animate-ping opacity-25" />

                            {/* Shield Icon in Core */}
                            <Shield className="size-16 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                        </div>

                        {/* Orbiting Tech Nodes */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                            <Key className="size-4 text-rose-400" />
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                            <Fingerprint className="size-4 text-indigo-400" />
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                            <Lock className="size-4 text-emerald-400" />
                        </div>
                    </div>

                    {/* Floating Tech Badges */}
                    <div className="mt-10 flex flex-wrap gap-2.5 justify-center max-w-sm">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                            Zero-Trust Access
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                            Passkey Enabled
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                            MFA Guarded
                        </span>
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="relative z-20 space-y-2.5 max-w-md">
                    <p className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">
                        Enterprise Identity Platform
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Secure Access Portal equipped with multi-layered credential checking, brute-force mitigation, and hardware-bound passkeys.
                    </p>
                </div>
            </div>

            {/* Right Column: Clean Form Layout */}
            <div className="w-full h-full lg:p-8 flex items-center justify-center relative bg-background">
                {/* Decorative background gradients for mobile/tablet */}
                <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[80px] lg:hidden pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-rose-500/5 blur-[90px] lg:hidden pointer-events-none" />

                <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center space-y-6 relative z-10">
                    {/* Header Logo for Mobile */}
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2 lg:hidden transition-transform duration-200 hover:scale-105"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-md overflow-hidden p-1">
                            <AppLogoDynamic className="size-full object-contain" iconClassName="size-5 fill-current text-white dark:text-zinc-950" />
                        </div>
                    </Link>

                    {/* Page Header */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground max-w-[300px]">
                            {description}
                        </p>
                    </div>

                    {/* Children Form Content */}
                    <div className="bg-card/40 border border-border/30 backdrop-blur-md p-6 rounded-2xl shadow-sm sm:shadow-md lg:shadow-none lg:p-0 lg:bg-transparent lg:border-none lg:backdrop-blur-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
