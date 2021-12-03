import { charMachine } from "./charMachine";

export const EPSILON = "ε";

export const epsilonMachine = () => {
  return charMachine(EPSILON);
};
