import { useContext } from "react";
import { AtomosContext } from "@/service/atomos/context";

export const useAtomos = () => {
    const context = useContext(AtomosContext);
    if (!context) {
        throw new Error('useAtomos must be used within a AtomosProvider');
    }
    return context;
};