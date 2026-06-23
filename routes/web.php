<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Settings\ApiTokenController;
use App\Http\Controllers\Admin\SecurityController as AdminSecurityController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('roles', RoleController::class);
    Route::resource('admin/users', UserController::class);
    Route::post('admin/impersonate/leave', [\App\Http\Controllers\Admin\ImpersonateController::class, 'leave'])->name('admin.impersonate.leave');
    Route::post('admin/impersonate/{user}', [\App\Http\Controllers\Admin\ImpersonateController::class, 'impersonate'])->name('admin.impersonate');

    // Security Settings — Overview
    Route::get('admin/security', [AdminSecurityController::class, 'index'])->name('admin.security.index');

    // Security Settings — Sub-pages
    Route::get('admin/security/password', [AdminSecurityController::class, 'password'])->name('admin.security.password');
    Route::get('admin/security/sessions', [AdminSecurityController::class, 'sessions'])->name('admin.security.sessions');
    Route::get('admin/security/access',   [AdminSecurityController::class, 'access'])->name('admin.security.access');
    Route::get('admin/security/accounts', [AdminSecurityController::class, 'accounts'])->name('admin.security.accounts');
    Route::get('admin/security/audit',    [AdminSecurityController::class, 'audit'])->name('admin.security.audit');

    // Security Settings — Unified update with section param
    Route::put('admin/security/{section}', [AdminSecurityController::class, 'update'])->name('admin.security.update');

    // Branding Settings
    Route::post('admin/branding', [\App\Http\Controllers\Admin\BrandingController::class, 'update'])->name('admin.branding.update');
    Route::delete('admin/branding/{type}', [\App\Http\Controllers\Admin\BrandingController::class, 'destroy'])->name('admin.branding.destroy');

    // Personal Access Tokens (API Keys) settings
    Route::get('settings/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
    Route::post('settings/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
    Route::delete('settings/api-tokens/{token}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');

    // Chat System Routes
    Route::get('chat', [\App\Http\Controllers\ChatController::class, 'fallback'])->name('chat.fallback');
    Route::get('chat/{receiver}', [\App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');
    Route::post('chat/{receiver}', [\App\Http\Controllers\ChatController::class, 'store'])->name('chat.store');

    // Transaction Notification Routes
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
});

require __DIR__.'/settings.php';
