import { NFA } from "./NFA";
import { State } from "./State";

export const charMachine = (symbol: string): NFA => {
  const inputState = new State();
  const outputState = new State({ isAccepting: true });

  inputState.addTransitionForSymbol(symbol, outputState);

  return new NFA({ inputState, outputState });
};
