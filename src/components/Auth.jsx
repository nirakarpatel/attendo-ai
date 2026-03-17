import { useState } from "react";
import { LogIn, Key, Mail, Loader2, AlertCircle } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { supabase } from "../lib/supabaseClient";

export function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isResetPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin
                });
                if (error) throw error;
                setMessage('Success! Check your email for a password reset link.');
                setIsResetPassword(false);
            } else if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Success! You can now log in.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // successful login will naturally trigger onAuthStateChange
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                        <Key className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                        {isResetPassword ? 'Reset Password' : isSignUp ? 'Create your account' : 'Welcome to Attendo'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isResetPassword ? 'Enter your email to receive a reset link' : isSignUp ? 'Sign up to sync your attendance everywhere' : 'Sign in to access your attendance data'}
                    </p>
                </div>

                <Card className="bg-card/50 border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                    {/* Error / Success Messages */}
                    {error && (
                        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm">
                            <p>{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-secondary/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {!isResetPassword && <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                                {!isSignUp && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsResetPassword(true); setError(null); setMessage(null); }}
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="password"
                                    required={!isResetPassword}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-secondary/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>}

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                            {isResetPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </form>

                    {!isResetPassword && <>
                        <div className="mt-6 flex items-center justify-center">
                            <div className="border-t border-white/10 flex-grow"></div>
                            <span className="px-3 text-xs text-muted-foreground uppercase font-medium">Or continue with</span>
                            <div className="border-t border-white/10 flex-grow"></div>
                        </div>

                        <div className="mt-6">
                            <Button
                                onClick={handleGoogleLogin}
                                type="button"
                                variant="secondary"
                                disabled={isLoading}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground py-2.5 rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </Button>
                        </div>
                    </>}
                </Card>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    {isResetPassword ? (
                        <button
                            onClick={() => { setIsResetPassword(false); setError(null); setMessage(null); }}
                            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
                        >
                            Back to sign in
                        </button>
                    ) : (
                        <>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
