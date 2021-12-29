/**
 * Minimizes an original DFA, merging some states
 *   together, using standard 0-, 1-, 2-, ...,
 *   N-equivalence algorithm.
 *
 */
export class DFAMinimizer {
  public getAcceptingStates(originalTable) {
    const acceptingStates = Object.keys(originalTable)
      .filter(state => state.startsWith("*"))
      .map(state => state.replace("*", ""));

    return acceptingStates;
  }

  private getNonAcceptingStates(originalTable) {
    const nonAcceptingStates = Object.keys(originalTable)
      .filter(state => !state.startsWith("*"))
      .map(state => state.replace("->", ""));

    return nonAcceptingStates;
  }

  private getColumns(originalTable) {
    const columns = Object.keys(Object.values(originalTable)[0]);

    return columns;
  }

  private getColumnsForState(state, table) {
    return table[state] || table[`->${state}`] || table[`*${state}`];
  }

  private areStatesEqual(
    state1,
    state2,
    previousEquivalenceRow,
    originalTable
  ) {
    const transitionColumnsForState1 = this.getColumnsForState(
      state1,
      originalTable
    );
    const transitionColumnsForState2 = this.getColumnsForState(
      state2,
      originalTable
    );

    for (const character of this.getColumns(originalTable)) {
      /**
       * If there are no transitions for both states on
       *   the same symbol - the states can be equal.
       *   We can continue checking transitions
       *   on other characters.
       *
       */
      if (
        transitionColumnsForState1[character] === null &&
        transitionColumnsForState2[character] === null
      ) {
        continue;
      }

      /**
       * If both transition states are sitting in the same
       *   subset from the previous equivalence row - we
       *   continue the loop, cause the states can be equal
       *   if the equality is confirmed during all iteration
       *   loops.
       *
       */
      const subsetOfStates = previousEquivalenceRow.find(
        previousSubsetOfStates => {
          return (
            previousSubsetOfStates.includes(
              String(transitionColumnsForState1[character])
            ) &&
            previousSubsetOfStates.includes(
              String(transitionColumnsForState2[character])
            )
          );
        }
      );

      if (subsetOfStates) {
        continue;
      }

      return false;
    }

    return true;
  }

  /**
   * We need to find the equivalence set,
   *   that will help us to minimize the original DFA (
   *   thanks to the standard 0-, 1-, 2-, ..., N-equivalence
   *   algorithm).
   *
   */
  private findEquivalenceSet(originalTable) {
    const nonAcceptingStates = this.getNonAcceptingStates(originalTable);
    const acceptingStates = this.getAcceptingStates(originalTable);

    /**
     * Initial equivalence sets, that according to the algorithm
     *   contains two sets of all states DFA includes:
     *   - set of all accepting states;
     *   - set of all non-accepting states.
     *
     */
    const initialEquivalenceSet = [nonAcceptingStates, acceptingStates];

    /**
     * Creates equivalence sets we will loop through,
     *   minimizing the DFA.
     *
     */
    const equivalenceSets = [initialEquivalenceSet];

    /**
     * This is where the minimization starts.
     *   The iteration ends up when last two sets
     *   are completely equal to each other. The equality
     *   of two last sets says, that there is no opportunity
     *   to minimize it further.
     *
     */
    for (const equivalenceSet of equivalenceSets) {
      /**
       * Each new loop circle stars with adding new set
       *   to the equivalence sets. On a road we will update
       *   this new set with states from the previous set,
       *   merging them together.
       *
       */
      const newEquivalenceSet = [];
      equivalenceSets.push(newEquivalenceSet);

      for (const statesSubset of equivalenceSet) {
        /**
         * If the states subset from the previous equivalence set
         *   contains only 1 item we just add it to the new
         *   equivalence set and start iterating through the next
         *   states subset.
         *
         *   The reason we're doing like that
         *     is because according to the algorithm we're comparing
         *     only the states of the same set to make decision
         *     to merge them together or to split on different
         *     sets. We don't compare states from different sets.
         *
         */
        if (statesSubset.length === 1) {
          newEquivalenceSet.push([...statesSubset]);

          continue;
        }

        /**
         * We're iterating through each states subset
         *   of the current equivalence row (that contains at least two items),
         *   comparing them together, making decision to split them
         *   on different states sets for the next equivalence row
         *   or not.
         *
         */
        const newSubsetsFromTheCurrentSet = [];
        /**
         * Here we take state from the states subset
         *   of the previous equivalence row.
         *
         */
        for (const state of statesSubset) {
          let areStatesEqual = false;

          /**
           * Here we compare the state we take from the
           *   states subset with one of the states of the
           *   last subset in the new equivalence set.
           *
           * If the state from the previous states subset
           *   is the first one we skip the comparison but
           *   instead just create new subset in the
           *   new equivalence set and put it there.
           *
           */
          if (statesSubset[0] !== state) {
            /**
             * We compare the state we took from the
             *   subset of the previous equivalence row with
             *   the states of all subsets, that were added
             *   to the new equivalence row during the iteration
             *   through subset of the previous row.
             *
             * Important to point out, that we compare
             *   only the states of the same subset from
             *   the previous equivalence row.
             *
             */
            for (const newStatesSubset of newSubsetsFromTheCurrentSet) {
              const newSubsetState = newStatesSubset[0];

              areStatesEqual = this.areStatesEqual(
                state,
                newSubsetState,
                equivalenceSet,
                originalTable
              );

              if (areStatesEqual) {
                newStatesSubset.push(state);

                break;
              }
            }
          }

          if (!areStatesEqual) {
            /**
             * It's important to add the same subset
             *   to two different sets, cause adding
             *   state to one of them we need to add
             *   this state to another one at the same
             *   time in case when the states are equal.
             *
             */
            const newSubset = [state];
            newEquivalenceSet.push(newSubset);
            newSubsetsFromTheCurrentSet.push(newSubset);
          }
        }
      }

      /**
       * If the previous two equivalence rows are equal - then
       *   the DFA minimization is finished. And, it means we found
       *   the minimized DFA.
       *
       */
      if (
        JSON.stringify(equivalenceSets[equivalenceSets.length - 1]) ===
        JSON.stringify(equivalenceSets[equivalenceSets.length - 2])
      ) {
        break;
      }
    }

    return equivalenceSets[equivalenceSets.length - 1];
  }

  private removeRedundantStates(originalTable, equivalenceSet) {
    /**
     * The goal is to merge all the states of each subset
     *   into one (with the minimum value among all the values).
     *
     * So, here we prepare a map, that maps the first element of each
     *   states subset to the whole subset.
     *
     */
    const mapStateToStatesToMerge = equivalenceSet.reduce(
      (resultMap, states) => {
        resultMap[states[0]] = states;

        return resultMap;
      },
      {}
    );

    return Object.entries(originalTable).reduce(
      (resultTable, [rowLabel, columns]) => {
        const stateLabel = rowLabel.replace("*", "").replace("->", "");

        /**
         * If the map does not contain the rowLabel
         *   as a key, we skip this row from the original
         *   table. As result this row will be removed
         *   from the original table.
         *
         */
        if (!mapStateToStatesToMerge[stateLabel]) {
          return resultTable;
        }

        /**
         * Transforms columns, replacing the state label
         *   from the original table with the key name
         *   from the mapStateToStatesToMerge.
         *
         */
        const transformedColumns = Object.entries(columns).reduce(
          (resultColumns, [character, stateToReplace]) => {
            if (stateToReplace === null) {
              /**
               * If there's no transition on a character,
               *   we store null for the character.
               *
               */
              resultColumns[character] = null;
            } else {
              /**
               * If there's a transition on a character,
               *   we replace the target state label
               *   with the new one from the map.
               *
               */
              Object.entries(mapStateToStatesToMerge).forEach(
                ([newState, statesToMerge]) => {
                  if ((statesToMerge as any).includes(String(stateToReplace))) {
                    resultColumns[character] = newState;
                  }
                }
              );
            }

            return resultColumns;
          },
          {}
        );

        resultTable[rowLabel] = transformedColumns;

        return resultTable;
      },
      {}
    );
  }

  public minimize(originalTable) {
    const equivalenceSet = this.findEquivalenceSet(originalTable);

    const minimizedTable = this.removeRedundantStates(
      originalTable,
      equivalenceSet
    );

    return minimizedTable;
  }
}
