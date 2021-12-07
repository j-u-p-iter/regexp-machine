import { EPSILON } from "./machines/epsilonMachine";
import { State } from "./State";

/**
 * Each Transition Table Row
 *   consists of columns. Each column is a map
 *   between the transition symbol and the state
 *   that transition symbol leads to.
 *
 * Also row
 */
interface NFATransitionTableRow {
  columns: {
    [key: string]: Array<State["label"]>;
  };
}

/**
 * NFA transition table consists rows,
 *   labeled with State label.
 *   Each row shows the states the
 *   state, the row labeled by, can transit to.
 *
 */
interface NFATransitionTable {
  [key: string]: NFATransitionTableRow;
}

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

    const getAlphabet = (state = this.inputState) => {
      resultAlphabet = new Set([
        ...Array.from(state.getAllTransitions().keys()),
        ...Array.from(resultAlphabet)
      ]);

      const nextStates = state.getAllTransitionsStates();

      for (const nextState of nextStates) {
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
          return statesWithLabel;
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

  public getTransitionTable(): NFATransitionTable {
    const alphabet = this.getAlphabet();

    const resultTable = this.setLabelsForStates().reduce((table, rowState) => {
      const stateLabel = rowState.getLabel();
      const rowLabel = rowState.isStarting
        ? `->${stateLabel}`
        : rowState.isAccepting
        ? `*${stateLabel}`
        : stateLabel;

      const columns = [...alphabet, EPSILON].reduce((rowColumns, character) => {
        const columnName = character === EPSILON ? `${EPSILON}*` : character;

        return {
          ...rowColumns,
          [columnName]: rowState
            .getTransitionsForSymbol(character)
            .map(state => state.getLabel())
        };
      }, {});

      return {
        ...table,
        [rowLabel]: columns
      };
    }, {});

    return resultTable;
  }
}
