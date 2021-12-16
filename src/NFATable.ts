import { EPSILON } from "./machines/epsilonMachine";
import { NFA } from "./NFA";
import { State } from "./State";

/**
 * Each Transition Table Row
 *   consists of columns. Each column is a map
 *   between the transition symbol and the state
 *   that transition symbol leads to.
 *
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

export class NFATable {
  constructor(private nfa: NFA) {}

  public getColumns() {
    return this.nfa.getAlphabet();
  }

  public getStartingState() {
    return this.nfa.inputState.getLabel();
  }

  public getAcceptingState() {
    return this.nfa.outputState.getLabel();
  }

  public create(): NFATransitionTable {
    const alphabet = this.nfa.getAlphabet();

    const resultTable = this.nfa
      .setLabelsForStates()
      .reduce((table, rowState) => {
        const stateLabel = rowState.getLabel();
        const rowLabel = rowState.isStarting
          ? `->${stateLabel}`
          : rowState.isAccepting
          ? `*${stateLabel}`
          : stateLabel;

        const columns = [...alphabet, EPSILON].reduce(
          (rowColumns, character) => {
            const columnName =
              character === EPSILON ? `${EPSILON}*` : character;

            const transitionStates = rowState
              .getTransitionsForSymbol(character)
              .map(state => state.getLabel());

            const allStates =
              character === EPSILON
                ? [rowState.getLabel(), ...transitionStates]
                : transitionStates;

            return {
              ...rowColumns,
              [columnName]: allStates
            };
          },
          {}
        );

        return {
          ...table,
          [rowLabel]: columns
        };
      }, {});

    return resultTable;
  }
}
