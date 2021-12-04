import { NFA } from "../NFA";
import { State } from "../State";

/**
 * Creates NFA fragment, related to the next regexp: /^a$/.
 *   Here instead of "a" can be any arbitrary symbol.
 *
 */
export const charMachine = (character: string): NFA => {
  const inputState = new State();
  const outputState = new State({ isAccepting: true });

  inputState.addTransitionForSymbol(character, outputState);

  return new NFA({ inputState, outputState });
};
