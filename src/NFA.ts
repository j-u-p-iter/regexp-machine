import { EPSILON } from "./machines/epsilonMachine";
import { State } from "./State";

interface NFAOptions {
  inputState: State;
  outputState: State;
}

export class NFA {
  constructor({ inputState, outputState }: NFAOptions) {
    this.inputState = inputState;
    this.outputState = outputState;
  }

  public inputState: State;
  public outputState: State;

  public getAlphabet(): string[] {
    /**
     * We use Set here, cause the characters can repeat
     *  from state to state, and we need to have only one character
     *  in the result set, even if there're are multiple transitions
     *  on the same character in NFA.
     */

    let resultAlphabet = new Set<string>();
    const visitedStates = new Set<State>();

    const getAlphabet = (state = this.inputState) => {
      resultAlphabet = new Set([
        ...Array.from(state.getAllTransitions().keys()),
        ...Array.from(resultAlphabet)
      ]);

      const nextStates = state.getAllTransitionsStates();

      for (const nextState of nextStates) {
        if (visitedStates.has(nextState)) {
          return;
        }

        visitedStates.add(nextState);

        getAlphabet(nextState);
      }
    };

    getAlphabet();

    return Array.from(resultAlphabet).filter(
      character => character !== EPSILON
    );
  }

  /**
   * Tests whether this NFA matches the string.
   *   In other words it tests whether this machine
   *   accepts the string or not.
   *   Delegates to the input state.
   *
   */
  public test(characters: string) {
    return this.inputState.test(characters);
  }

  public setLabelsForStates() {
    let rowNumber = 0;
    const visitedState = new Set();

    const setLabelsForStates = (
      states = [this.inputState],
      statesWithLabel = []
    ) => {
      return states.reduce((resultMap, state) => {
        /**
         * Not to include the row for the same state twice.
         *
         */
        if (visitedState.has(state)) {
          return resultMap;
        }

        visitedState.add(state);

        if (!state.getLabel()) {
          rowNumber = rowNumber + 1;

          state.setLabel(rowNumber);
        }

        const allTransitionStates = state.getAllTransitionsStates();

        return setLabelsForStates(allTransitionStates, [...resultMap, state]);
      }, statesWithLabel);
    };

    return setLabelsForStates();
  }
}
