import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    // Make Pusher available globally as required by Laravel Echo
    window.Pusher = Pusher;

    // Determine connections properties from Vite environments
    const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
    const host = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';
    const port = import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT, 10) : 8080;
    const isSecure = scheme === 'https';

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: isSecure,
        enabledTransports: ['ws', 'wss'],
    });
}
