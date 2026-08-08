import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect, useRef,
    useMemo,
    useState
} from 'react';

const AuthContext = createContext<{
    signIn: (arg0: string) => void;
    signOut: () => void;
    token: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    token: null,
    isLoading: true
})

// Access the context as a hook
export function useAuthSession() {
    return useContext(AuthContext);
}

export default function AuthProvider ({children}:{children: ReactNode}): ReactNode {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;
        console.log('AuthProvider: Starting token restore');
        (async ():Promise<void> => {
            try {
                console.log('AuthProvider: Getting token from AsyncStorage');
                const storedToken = await AsyncStorage.getItem('@token');
                console.log('AuthProvider: Got token:', storedToken ? 'exists' : 'null');
                setToken((storedToken && storedToken.length > 0) ? storedToken : null);
                console.log('AuthProvider: Token state set');
            } catch (e) {
                console.error('AuthProvider: Token restore failed:', e);
                setToken(null);
            } finally {
                console.log('AuthProvider: Setting isLoading to false');
                setIsLoading(false);
            }
        })()
    }, []);

    const signIn = useCallback(async (token: string) => {
        await AsyncStorage.setItem('@token', token);
        setToken(token);
        router.replace('/(authorized)');
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.setItem('@token', '');
        setToken(null);
        router.replace('/');
    }, []);

    const value = useMemo(() => ({
        signIn,
        signOut,
        token,
        isLoading
    }), [token, isLoading, signIn, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};