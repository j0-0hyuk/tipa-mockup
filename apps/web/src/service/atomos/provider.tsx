import { atomos } from "@/service/atomos/instance";
import { AtomosContext } from "@/service/atomos/context";

export default function AtomosProvider({ children }: { children: React.ReactNode }) {
    return <AtomosContext.Provider value={atomos}>{children}</AtomosContext.Provider>;
}