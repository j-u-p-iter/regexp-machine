import { NFA } from "../NFA";
import { EPSILON } from "./epsilonMachine";

/**
 * Creates NFA fragment, related to the next regexp: /^a+$/.
 *   Here instead of "a" can be any arbitrary symbol.
 *
 */

export const plusMachine = (fragment: NFA): NFA => {
  /**
   * Epsilon transition from the output state back to the
   *   input state in case repetitions more than one time.
   *
   */
  fragment.outputState.addTransitionForSymbol(EPSILON, fragment.inputState);

  return fragment;
};
