import supabase, { Session, AuthChangeEvent } from "@/lib/subabaseClient";
import {router} from "expo-router";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {User} from "@supabase/supabase-js";

type AuthContextValue = {
    session: Session | null;
    isLoading: boolean;
    signUpNewUser: (arg0: string, arg1: string, arg2: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    signOut: () => void;
    loginUser: (arg0: string, arg1: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    getUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue>({
    session: null,
    isLoading: true,
    signUpNewUser: () => Promise.resolve({ success: false, error: "Not implemented" }),
    signOut: () => Promise.resolve(undefined),
    loginUser: () => Promise.resolve({ success: false, error: "Not implemented" }),
    getUser: () => Promise.resolve(null)
})

// Access the context as a hook
export function useAuthSession() {
    return useContext(AuthContext);
}

export default function AuthProvider ({children}:{children: ReactNode}): ReactNode {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({data}: { data: { session: Session | null } }) => {
            if (!mounted) return;

            console.log('CHECKING FOR EXISTING SESSION');
            setSession(data.session);
            setIsLoading(false);
            if (data.session !== null) {
                console.log('SESSION FOUND');
                router.replace('/(authorized)');
            } else {
                console.log('NO SESSION FOUND');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (!mounted) return;

            setSession(nextSession);
            setIsLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const loginUser = useCallback(async (email: string, password: string): Promise<{ success: boolean; data?: any; error?: string }> => {
        try {
            const  { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error("Sign-in error occurred: ", error);
                return { success: false, error: error.message };
            }
            console.log("Sign-in success", data);
            return { success: true, data };
        }
        catch (error: any) {
            console.error("Sign-in error occurred:", error);
            return { success: false, error: error.message }
        }
    }, []);

    // Signup
    const signUpNewUser = async (email: string, password: string, displayName: string): Promise<{ success: boolean; data?: any; error?: string }> => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: displayName,
                }
            }
        });

        if (error) {
            console.error("There was a problem signing up: ", error);
            return { success: false, error: error.message };
        }
        return { success: true, data };
    }

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("There was an error: ", error);
        }
        router.replace('/');
    }, []);

    const getUser = useCallback(async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error("There was an error while fetching current user: ", error);
            }
            return user;
        } catch (err) {
            console.log('Failed to get current user:', err);
            return null;
        }
    }, []);

    const value = useMemo(() => ({
        session,
        isLoading,
        signUpNewUser,
        signOut,
        loginUser,
        getUser
    }), [session, signUpNewUser, signOut, loginUser, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};