import { createContext } from "react";
import { Atomos } from "@/service/atomos/instance";

export const AtomosContext = createContext<Atomos | null>(null);