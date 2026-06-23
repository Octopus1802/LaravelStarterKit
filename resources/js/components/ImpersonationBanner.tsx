import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { ShieldAlert, LogOut, Loader2 } from 'lucide-react';
import type { PageProps } from '@inertiajs/core';

export default function ImpersonationBanner() {
    const { auth } = usePage<PageProps>().props;
    const [isLeaving, setIsLeaving] = useState(false);

    // If there is no impersonator active, do not render the banner
    if (!auth || !auth.impersonator) {
        return null;
    }

    const handleLeave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLeaving(true);
        router.post('/admin/impersonate/leave', {}, {
            onFinish: () => setIsLeaving(false)
        });
    };

    return (
        <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg animate-pulse">
                        <ShieldAlert className="h-4 w-4 text-amber-100" />
                    </div>
                    <div className="text-center sm:text-left">
                        <span className="font-semibold tracking-wide">Impersonation Session Active: </span>
                        <span>
                            Logged in as <strong className="underline decoration-amber-300 font-bold">{auth.user.name}</strong> ({auth.user.email})
                        </span>
                        <span className="hidden md:inline text-amber-200"> • </span>
                        <span className="text-xs text-amber-100 block md:inline mt-0.5 md:mt-0">
                            Original: {auth.impersonator.name} ({auth.impersonator.email})
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLeave}
                    disabled={isLeaving}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 hover:border-white/40 disabled:opacity-50 text-white font-medium px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
                >
                    {isLeaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <LogOut className="h-3.5 w-3.5" />
                    )}
                    Return to Admin
                </button>
            </div>
        </div>
    );
}
