<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecuritySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityController extends Controller
{
    /**
     * Security Overview / Dashboard
     */
    public function index()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        $auditLogs = $this->paginateArray($this->getAuditLogs(), 5);

        return Inertia::render('Admin/Security/Index', [
            'settings'  => $settings,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Password Policy sub-page
     */
    public function password()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        return Inertia::render('Admin/Security/Password', ['settings' => $settings]);
    }

    /**
     * Session & Lockout sub-page
     */
    public function sessions()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        return Inertia::render('Admin/Security/Sessions', ['settings' => $settings]);
    }

    /**
     * MFA & Access Control sub-page
     */
    public function access()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        return Inertia::render('Admin/Security/Access', ['settings' => $settings]);
    }

    /**
     * Account Lifecycle sub-page
     */
    public function accounts()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        return Inertia::render('Admin/Security/Accounts', ['settings' => $settings]);
    }

    /**
     * Audit & Notifications sub-page
     */
    public function audit()
    {
        $settings = SecuritySetting::firstOrCreate([]);
        $auditLogs = $this->paginateArray($this->getAuditLogs(), 10);
        return Inertia::render('Admin/Security/Audit', [
            'settings'  => $settings,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Update a specific section of security settings
     */
    public function update(Request $request, string $section)
    {
        $settings = SecuritySetting::firstOrCreate([]);

        $rules = match ($section) {
            'password' => [
                'password_min_length'        => 'required|integer|min:8|max:64',
                'password_require_uppercase' => 'required|boolean',
                'password_require_numeric'   => 'required|boolean',
                'password_require_special'   => 'required|boolean',
                'password_max_age_days'      => 'required|integer|min:1|max:365',
                'password_history_count'     => 'required|integer|min:0|max:24',
                'password_ban_common'        => 'required|boolean',
            ],
            'sessions' => [
                'login_max_attempts'              => 'required|integer|min:3|max:20',
                'lockout_duration_minutes'        => 'required|integer|min:1|max:1440',
                'captcha_after_attempts'          => 'required|integer|min:1|max:10',
                'progressive_lockout_enabled'     => 'required|boolean',
                'session_lifetime_minutes'        => 'required|integer|min:5|max:10080',
                'idle_timeout_minutes'            => 'required|integer|min:5|max:1440',
                'remember_me_max_days'            => 'required|integer|min:1|max:365',
                'session_invalidate_on_ip_change' => 'required|boolean',
                'session_invalidate_on_ua_change' => 'required|boolean',
                'session_single_device_only'      => 'required|boolean',
            ],
            'access' => [
                'enforce_mfa_admins'       => 'required|boolean',
                'enforce_mfa_all_users'    => 'required|boolean',
                'mfa_grace_period_hours'   => 'required|integer|min:0|max:168',
                'backup_codes_count'       => 'required|integer|min:4|max:16',
                'allow_tor_exit_nodes'     => 'required|boolean',
                'force_https'              => 'required|boolean',
                'ip_whitelist'             => 'nullable|string',
                'ip_blacklist'             => 'nullable|string',
                'geo_block_countries'      => 'nullable|string',
                'allowed_mfa_methods'      => 'nullable|array',
                'allowed_mfa_methods.*'    => 'string|in:totp,passkey,email,sms',
            ],
            'accounts' => [
                'registration_enabled'       => 'required|boolean',
                'require_email_verification' => 'required|boolean',
                'account_inactive_days'      => 'required|integer|min:30|max:730',
                'allow_self_deletion'        => 'required|boolean',
                'max_users'                  => 'nullable|integer|min:1',
            ],
            'audit' => [
                'audit_log_retention_days' => 'required|integer|min:30|max:3650',
                'log_failed_logins'        => 'required|boolean',
                'log_permission_changes'   => 'required|boolean',
                'notify_admin_on_breach'   => 'required|boolean',
                'notify_admin_email'       => 'nullable|email',
            ],
            default => abort(404),
        };

        $validated = $request->validate($rules);

        // Cast JSON fields
        if (isset($validated['allowed_mfa_methods'])) {
            $validated['allowed_mfa_methods'] = json_encode($validated['allowed_mfa_methods']);
        }

        $settings->update($validated);

        return back()->with('message', 'Security settings updated successfully.');
    }

    /**
     * Helper to paginate an array
     */
    private function paginateArray(array $items, int $perPage)
    {
        $currentPage = \Illuminate\Pagination\LengthAwarePaginator::resolveCurrentPage();
        $itemCollection = collect($items);
        $currentPageItems = $itemCollection->slice(($currentPage * $perPage) - $perPage, $perPage)->values()->all();
        $paginatedItems = new \Illuminate\Pagination\LengthAwarePaginator(
            $currentPageItems,
            count($itemCollection),
            $perPage,
            $currentPage,
            ['path' => \Illuminate\Pagination\LengthAwarePaginator::resolveCurrentPath()]
        );
        return $paginatedItems->withQueryString();
    }

    /**
     * Sample audit logs (replace with real DB query when audit_logs table exists)
     */
    private function getAuditLogs(): array
    {
        return [
            [
                'id'          => 1,
                'event'       => 'MFA Settings Toggled',
                'description' => 'Enforce MFA globally was disabled.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subMinutes(12)->toIso8601String(),
            ],
            [
                'id'          => 2,
                'event'       => 'Role Permissions Updated',
                'description' => 'Manager permission list updated.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subHours(2)->toIso8601String(),
            ],
            [
                'id'          => 3,
                'event'       => 'Failed Admin Login Attempt',
                'description' => 'IP blocked temporarily due to brute force threshold.',
                'user'        => 'unknown_attacker@hack.net',
                'ip'          => '45.132.99.12',
                'created_at'  => now()->subHours(5)->toIso8601String(),
            ],
            [
                'id'          => 4,
                'event'       => 'User Account Registered',
                'description' => 'User "manager@example.com" registered as Manager.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(1)->toIso8601String(),
            ],
            [
                'id'          => 5,
                'event'       => 'Security Settings Updated',
                'description' => 'Password policy updated: min length changed to 14.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(2)->toIso8601String(),
            ],
            [
                'id'          => 6,
                'event'       => 'Failed Login Attempt',
                'description' => 'Incorrect password entered for "user@example.com".',
                'user'        => 'user@example.com',
                'ip'          => '198.51.100.42',
                'created_at'  => now()->subDays(2)->subHours(3)->toIso8601String(),
            ],
            [
                'id'          => 7,
                'event'       => 'User Role Assigned',
                'description' => 'Assigned "Editor" role to user "editor@example.com".',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(3)->toIso8601String(),
            ],
            [
                'id'          => 8,
                'event'       => 'IP Address Whitelisted',
                'description' => 'Added IP range "10.0.0.0/24" to white list.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(4)->toIso8601String(),
            ],
            [
                'id'          => 9,
                'event'       => 'Database Backup Initiated',
                'description' => 'Manual full database backup export generated.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(4)->subHours(6)->toIso8601String(),
            ],
            [
                'id'          => 10,
                'event'       => 'MFA Reset Request',
                'description' => 'Admin reset MFA token for "developer@example.com".',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(5)->toIso8601String(),
            ],
            [
                'id'          => 11,
                'event'       => 'Force HTTPS Enabled',
                'description' => 'Security policy modified: enforce HTTP redirects to SSL.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(6)->toIso8601String(),
            ],
            [
                'id'          => 12,
                'event'       => 'API Token Generated',
                'description' => 'Personal access token generated for webhook integration.',
                'user'        => 'manager@example.com',
                'ip'          => '192.168.1.15',
                'created_at'  => now()->subDays(7)->toIso8601String(),
            ],
            [
                'id'          => 13,
                'event'       => 'Suspicious Request Blocked',
                'description' => 'SQL Injection pattern blocked by Web Application Firewall.',
                'user'        => 'unknown_attacker@malicious.ru',
                'ip'          => '185.220.101.5',
                'created_at'  => now()->subDays(7)->subHours(12)->toIso8601String(),
            ],
            [
                'id'          => 14,
                'event'       => 'Admin Password Reset',
                'description' => 'Super-Admin password updated successfully.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(8)->toIso8601String(),
            ],
            [
                'id'          => 15,
                'event'       => 'Session Lifetime Changed',
                'description' => 'Idle timeout changed from 15 to 30 minutes.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(9)->toIso8601String(),
            ],
            [
                'id'          => 16,
                'event'       => 'User Deleted',
                'description' => 'User account "temp_contractor@example.com" removed.',
                'user'        => 'admin@example.com',
                'ip'          => '192.168.1.1',
                'created_at'  => now()->subDays(10)->toIso8601String(),
            ],
        ];
    }
}
