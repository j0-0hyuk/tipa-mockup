import { AuthContext } from "@/service/auth/context";
import { auth } from "@/service/auth/instance";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}