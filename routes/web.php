<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\SecurityController as AdminSecurityController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('roles', RoleController::class);
    Route::resource('admin/users', UserController::class);

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

    // Chat System Routes
    Route::get('chat', [\App\Http\Controllers\ChatController::class, 'fallback'])->name('chat.fallback');
    Route::get('chat/{receiver}', [\App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');
    Route::post('chat/{receiver}', [\App\Http\Controllers\ChatController::class, 'store'])->name('chat.store');
});

require __DIR__.'/settings.php';
