import { Form, Head } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';
import React from 'react';

import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email Address */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/75" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="pl-10 h-11 border-border/80 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background transition-all duration-200"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/75" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="pl-10 h-11 border-border/80 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background transition-all duration-200"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded border-border/90 data-[state=checked]:bg-indigo-600"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-foreground/80 cursor-pointer select-none leading-none">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm text-muted-foreground mt-2">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
