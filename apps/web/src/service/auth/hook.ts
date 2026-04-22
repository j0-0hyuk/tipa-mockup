import { useContext } from "react";
import { AuthContext } from "@/service/auth/context";

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('AuthContext is not found');
    }

    return auth;
};