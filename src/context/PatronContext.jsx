import { createContext, useContext } from "react";

export const PatronContext = createContext(null);

export function usePatron() {
  return useContext(PatronContext);
}
