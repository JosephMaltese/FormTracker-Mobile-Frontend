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

const AuthContext = createContext<{
    session: Session | null;
    signUpNewUser: (arg0: string, arg1: string, arg2: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    signOut: () => void;
    loginUser: (arg0: string, arg1: string) => Promise<{ success: boolean; data?: any; error?: string }>;

}>({
    session: null,
    signUpNewUser: () => Promise.resolve({ success: false, error: "Not implemented" }),
    signOut: () => Promise.resolve(undefined),
    loginUser: () => Promise.resolve({ success: false, error: "Not implemented" })
})

// Access the context as a hook
export function useAuthSession() {
    return useContext(AuthContext);
}

export default function AuthProvider ({children}:{children: ReactNode}): ReactNode {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data}: { data: { session: Session | null } }) => {
            setSession(data.session);
        });

        supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setSession(session);
        })
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

    const value = useMemo(() => ({
        session,
        signUpNewUser,
        signOut,
        loginUser
    }), [session, signUpNewUser, signOut, loginUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};