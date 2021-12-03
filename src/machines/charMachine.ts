import { NFA } from "../NFA";
import { State } from "../State";

export const charMachine = (character: string): NFA => {
  const inputState = new State();
  const outputState = new State({ isAccepting: true });

  inputState.addTransitionForSymbol(character, outputState);

  return new NFA({ inputState, outputState });
};
