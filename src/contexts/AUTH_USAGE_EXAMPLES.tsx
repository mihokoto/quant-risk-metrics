/**
 * Quick Reference: Using Authentication in Components
 * 
 * Import the useAuth hook to access authentication state and functions.
 */

import { useAuth } from '@/contexts/AuthContext';

// Example 1: Display content based on auth status
export function ExampleComponent() {
    const { user, isPro, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <div>Please sign in to continue</div>;
    }

    return (
        <div>
            <h1>Welcome {user.email}</h1>
            {isPro ? (
                <ProFeature />
            ) : (
                <UpgradePrompt />
            )}
        </div>
    );
}

// Example 2: Gate a premium feature
export function PremiumFeature() {
    const { isPro } = useAuth();

    if (!isPro) {
        return (
            <div className="blur-md opacity-50 pointer-events-none relative">
                <LockedContent />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button>Upgrade to Pro</button>
                </div>
            </div>
        );
    }

    return <FullFeature />;
}

// Example 3: Access all auth methods
export function AuthExample() {
    const {
        user,              // Current user object (or null)
        profile,           // User profile from database (includes tier)
        session,           // Current session
        loading,           // Loading state
        signUp,            // Function to sign up
        signIn,            // Function to sign in
        signInWithGoogle,  // Function for Google OAuth
        signOut,           // Function to sign out
        isPro,             // Boolean: is user Pro tier?
    } = useAuth();

    return <YourComponent />;
}

// Example 4: Conditional iteration limit based on tier
export function SimulationConfig() {
    const { isPro } = useAuth();
    const maxIterations = isPro ? 50000 : 5000;

    return (
        <Slider
            max={maxIterations}
        // ... other props
        />
    );
}
