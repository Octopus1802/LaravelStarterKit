import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { Auth as BaseAuth } from './auth';

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
        auth: BaseAuth & {
            roles: string[];
            permissions: string[];
        };
    }
}
