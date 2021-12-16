import { NFATable } from "./NFATable";

interface DFATransitionTableColumns {
  [key: string]: string | null;
}

interface DFATransitionTable {
  [key: string]: DFATransitionTableColumns;
}

export class DFATable {
  constructor(private nfaTable: NFATable) {}

  public create(): DFATransitionTable {
    this.nfaTable.create();

    /**
     * Starting state of the DFA is the epsilon closure
     *   of the starting state of the NFA (NFA has only one starting state).
     * DFA has only one starting state as NFA.
     */
    const dfaStartingState = this.nfaTable.getStartingStateEpsilonClosure();

    /**
     * In the original DFA table the states labels are represented as
     *   the set of states labels of the NFA.
     *
     */
    const dfaStartingStateLabel = dfaStartingState.join(",");

    /**
     * dfaStates is a dynamic set of dfa table row labels.
     *   While we create the table row we add new states label
     *   to this set to create new table row on one of
     *   the next iteration steps. If the table already
     *   contains this/that label we don't add it again.
     *   After the row for the table with this/that label
     *   is created we remove this/that label from the dfaStates,
     *   cause it was already used to create respective table
     *   row and can't be used again (there can't be multiple
     *   rows with the same label).
     *
     * After the iteration through all dfaStates is finished
     *   the table is considered to be built.
     *
     */
    const dfaStates = new Set<string>();
    dfaStates.add(dfaStartingStateLabel);

    const columns = this.nfaTable.getColumns();

    const dfaTransitionTable = {};

    dfaStates.forEach(rowLabel => {
      /**
       * Adds table row.
       *   Row label consists of the subset of
       *   states of the original NFA table.
       *
       */
      const dfaStatesLabels = rowLabel.split(",");
      dfaTransitionTable[rowLabel] = {};

      /**
       * Adds table columns.
       *   We loop through each state in the row label and
       *   search for transitions for each character of each
       *   state. The result set of states will be play role
       *   of the new state of the result DFA and will be put
       *   in the row label on the next step.
       *
       */

      /**
       * We iterate through alphabet,
       *   adding column for each character in the result table.
       */
      for (const character of columns) {
        let mergedStates = [];

        for (const stateLabel of dfaStatesLabels) {
          const nfaTableColumns = this.nfaTable.getRowColumns(stateLabel);
          /**
           * The column for each character in the alphabet
           *   is an empty array be default.
           *
           */
          const nextStatesOnCharacterTransition = nfaTableColumns[character];

          /**
           * The transition state contains labels of all states from the
           *   original NFA:
           *   1. Reached by transition on a character.
           *   2. Epsilon closure for all reached states by this transition.
           *
           * So, to find the new state we merge the reached states by the transition
           *   and the states reached by epsilon transition from the previously found
           *   states.
           *
           */
          let epsilonClosureForNextStates = [];

          for (const nextStateLabel of nextStatesOnCharacterTransition) {
            epsilonClosureForNextStates = [
              ...epsilonClosureForNextStates,
              ...this.nfaTable.getRowEpsilonClosure(nextStateLabel)
            ];
          }

          /**
           * Merges states from NFA table.
           *
           */
          mergedStates = [
            ...mergedStates,
            ...nextStatesOnCharacterTransition,
            ...Array.from(new Set(epsilonClosureForNextStates))
          ];
        }

        /**
         * Add merged states for the DFA table column.
         *
         */

        /**
         * Removes duplicates from an array and sort it alphabetically,
         *   cause the order of the states doesn't matter.
         */
        dfaTransitionTable[rowLabel][character] =
          Array.from(new Set(mergedStates))
            .sort()
            .join(",") || null;

        /**
         * The string, containing labels of the merged above states
         *   will serve as a label for the new table row, that will
         *   be added on one of the next iteration steps.
         *
         */
        const newDFAState = dfaTransitionTable[rowLabel][character];

        /**
         * We don't add the DFA state (subset of NFA states) to the dfaStates Set
         *   if this state already exists in the dfaTransitionTable.
         *
         *   The newDFAState can be an empty string, cause there's no
         *     such a transition for the character. In this case
         *     we don't need to add anything to the dfaStates.
         *
         */
        if (newDFAState && !dfaTransitionTable[newDFAState]) {
          dfaStates.add(newDFAState);
        }
      }

      dfaStates.delete(rowLabel);
    });

    return dfaTransitionTable;
  }
}
