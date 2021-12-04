import { NFA } from "../NFA";
import { EPSILON } from "./epsilonMachine";
/**
 * Creates NFA fragment, related to the next regexp: /^a?$/.
 *   Here instead of "a" can be any arbitrary symbol.
 *
 */

export const optionalMachine = (fragment: NFA): NFA => {
  fragment.inputState.addTransitionForSymbol(EPSILON, fragment.outputState);

  return fragment;
};
