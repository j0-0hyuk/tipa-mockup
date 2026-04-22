import { createContext } from "react";
import { auth } from "@/service/auth/instance";

export const AuthContext = createContext<typeof auth>(auth);