import { router, usePage } from '@inertiajs/react';
import { Camera, Loader2, Trash2, UploadCloud } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AvatarUploadZoneProps {
    /** Override the route name; defaults to 'profile.avatar.update' */
    uploadRoute?: string;
    /** Override the route name; defaults to 'profile.avatar.destroy' */
    deleteRoute?: string;
    /** Extra CSS classes on the root wrapper */
    className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Helper ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AvatarUploadZone
 *
 * Displays the current user avatar in a circular frame with an overlay
 * action button. Supports click-to-pick and drag-and-drop. Submits via
 * Inertia's `router.post` (multipart/form-data) so the CSRF token is
 * handled automatically — no manual fetch required.
 *
 * State machine:
 *   idle → (file chosen) → previewing → (form submitted) → uploading → idle
 */
export default function AvatarUploadZone({
    uploadRoute = 'profile.avatar.update',
    deleteRoute = 'profile.avatar.destroy',
    className,
}: AvatarUploadZoneProps) {
    // ── Inertia shared state ─────────────────────────────────────────────────
    const {
        auth: { user },
    } = usePage<{ auth: Auth }>().props;

    // ── Local state ──────────────────────────────────────────────────────────
    const [preview, setPreview] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // ── Derived values ───────────────────────────────────────────────────────
    const displaySrc = preview ?? user.avatar_url;
    const hasAvatar =
        Boolean(preview) ||
        (user.avatar_url && !user.avatar_url.includes('default-avatar'));
    const isLoading = uploading || deleting;

    // ── Cleanup object URLs on unmount ───────────────────────────────────────
    React.useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // ── Validation ───────────────────────────────────────────────────────────
    function validateFile(file: File): string | null {
        if (!ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])) {
            return 'Only JPEG, PNG, and WebP images are accepted.';
        }
        if (file.size > MAX_FILE_BYTES) {
            return 'File must be smaller than 5 MB.';
        }
        return null;
    }

    // ── Upload handler ───────────────────────────────────────────────────────
    function handleFile(file: File) {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);

        // Build local object URL for instant preview before server confirms
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);

        router.post(route(uploadRoute), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Inertia reloads shared props — preview can be cleared because
                // the server now returns the canonical URL via avatar_url.
                setPreview(null);
            },
            onError: (errors) => {
                setError(errors.avatar ?? 'Upload failed. Please try again.');
                // Revert the optimistic preview on failure
                setPreview(null);
            },
            onFinish: () => setUploading(false),
        });
    }

    // ── Delete handler ───────────────────────────────────────────────────────
    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        if (!hasAvatar || isLoading) return;

        setDeleting(true);
        router.delete(route(deleteRoute), {
            preserveScroll: true,
            onFinish: () => setDeleting(false),
        });
    }

    // ── Drag-and-drop ────────────────────────────────────────────────────────
    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    // ── Input change ─────────────────────────────────────────────────────────
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        // Reset so the same file can be re-selected
        e.target.value = '';
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {/* Hidden native file input */}
            <input
                id="avatar-file-input"
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_MIME_TYPES.join(',')}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
                onChange={handleInputChange}
            />

            {/* ── Avatar ring + drag-drop zone ── */}
            <div
                role="button"
                aria-label="Upload avatar — click or drag and drop an image"
                tabIndex={0}
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                        fileInputRef.current?.click();
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'group relative cursor-pointer rounded-full outline-none',
                    'ring-2 ring-offset-2 ring-offset-background transition-all duration-200',
                    isDragging
                        ? 'ring-primary scale-105'
                        : 'ring-transparent hover:ring-primary/60',
                    isLoading && 'pointer-events-none opacity-60',
                )}
            >
                {/* Avatar circle */}
                <Avatar className="size-24">
                    <AvatarImage
                        src={displaySrc}
                        alt={`${user.name}'s avatar`}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                {/* Loading spinner overlay */}
                {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                        <Loader2
                            className="size-6 text-white animate-spin"
                            aria-hidden="true"
                        />
                    </span>
                )}

                {/* Camera icon overlay — shown on hover when idle */}
                {!isLoading && (
                    <span
                        aria-hidden="true"
                        className={cn(
                            'absolute inset-0 flex flex-col items-center justify-center rounded-full',
                            'bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium gap-1',
                            'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                        )}
                    >
                        <Camera className="size-5" />
                        <span>Change</span>
                    </span>
                )}

                {/* Drag-active ring pulse */}
                {isDragging && (
                    <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary animate-pulse" />
                )}
            </div>

            {/* ── Action strip ── */}
            <div className="flex items-center gap-2">
                <Button
                    id="avatar-upload-btn"
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5"
                >
                    <UploadCloud className="size-4" aria-hidden="true" />
                    {uploading ? 'Uploading…' : 'Upload photo'}
                </Button>

                {hasAvatar && (
                    <Button
                        id="avatar-delete-btn"
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        onClick={handleDelete}
                        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {deleting ? 'Removing…' : 'Remove'}
                    </Button>
                )}
            </div>

            {/* ── File constraints hint ── */}
            <p className="text-xs text-muted-foreground text-center">
                JPEG, PNG or WebP · max 5 MB
            </p>

            {/* ── Validation / server error ── */}
            {error && (
                <p
                    role="alert"
                    className="text-xs text-destructive font-medium text-center max-w-[200px]"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
