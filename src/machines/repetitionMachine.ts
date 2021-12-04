import { NFA } from "../NFA";
import { State } from "../State";
import { EPSILON } from "./epsilonMachine";

/**
 * Creates NFA fragment, related to the next regexp: /^a*$/.
 *   Here instead of "a" can be any arbitrary symbol.
 *
 */
export const slowRepetitionMachine = (fragment: NFA): NFA => {
  fragment.outputState.isAccepting = false;

  const startingState = new State();
  const acceptingState = new State({ isAccepting: true });

  /**
   * Epsilon transition to the input state of the NFA fragment
   *   in case the string is not empty.
   *
   */
  startingState.addTransitionForSymbol(EPSILON, fragment.inputState);

  /**
   * Epsilon transition to the accepting state from the output
   *   state of NFA fragment.
   *
   */
  fragment.outputState.addTransitionForSymbol(EPSILON, acceptingState);

  /**
   * Epsilon transition straight to the accepting state
   *   in case the string is empty.
   *
   *
   */
  startingState.addTransitionForSymbol(EPSILON, acceptingState);

  /**
   * Epsilon transition from acceptingState back to the inputState
   *   of a fragment if the character repeats more than 1 time in a string.
   *
   *
   */
  acceptingState.addTransitionForSymbol(EPSILON, fragment.inputState);

  return new NFA({
    inputState: startingState,
    outputState: acceptingState
  });
};

export const repetitionMachine = (fragment: NFA): NFA => {
  /**
   * Epsilon transition from output state to the input state
   *   in case there're more than one repetitions.
   *
   */
  fragment.outputState.addTransitionForSymbol(EPSILON, fragment.inputState);

  /**
   * Epsilon transition straight to the accepting state
   *   in case the string is empty.
   *
   */
  fragment.inputState.addTransitionForSymbol(EPSILON, fragment.outputState);

  return fragment;
};
