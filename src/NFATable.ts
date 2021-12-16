import { EPSILON } from "./machines/epsilonMachine";
import { NFA } from "./NFA";
import { State } from "./State";

export const EPSILON_CLOSURE_COLUMN_NAME = `${EPSILON}*`;

export const getStartingRowLabel = rowLabel => `->${rowLabel}`;

export const getAcceptingRowLabel = rowLabel => `*${rowLabel}`;

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
  private table;

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

  public getStartingStateEpsilonClosure() {
    return this.getRowEpsilonClosure(this.getStartingState());
  }

  public getRowEpsilonClosure(rowLabel) {
    if (!this.table) {
      throw new Error("You should create table at first.");
    }

    return this.getRowColumns(rowLabel)[EPSILON_CLOSURE_COLUMN_NAME];
  }

  /**
   * rowLabel can be suffixed with the "->" symbol
   *   in case it's related to the starting state;
   *   also it can be suffixed with "*" symbol in case
   *   it's related to the accepting state.
   *
   *   The result is an array,
   *     cause it can contain multiple states,
   *     because nfa allows multiple transitions on the same symbol.
   *
   *   The column should always exist in the table for the stateLabel.
   *     So it doesn't make sence to check it's presense further in the code.
   *
   */
  public getRowColumns(rowLabel: string) {
    if (!this.table) {
      throw new Error("You should create table at first.");
    }

    return (
      this.table[rowLabel] ||
      this.table[getAcceptingRowLabel(rowLabel)] ||
      this.table[getStartingRowLabel(rowLabel)]
    );
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

    this.table = resultTable;

    return this.table;
  }
}
