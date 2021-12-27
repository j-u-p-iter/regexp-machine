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
      if (
        transitionColumnsForState1[character] === null &&
        transitionColumnsForState2[character] === null
      ) {
        continue;
      }

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

  public minimize(originalTable) {
    const nonAcceptingStates = this.getNonAcceptingStates(originalTable);
    const acceptingStates = this.getAcceptingStates(originalTable);

    const initialEquivalenceRow = [nonAcceptingStates, acceptingStates];
    const equivalenceArray = [initialEquivalenceRow];

    for (const equivalenceRow of equivalenceArray) {
      const newEquivalenceRow = [];

      equivalenceArray.push(newEquivalenceRow);

      for (const statesSubset of equivalenceRow) {
        if (statesSubset.length === 1) {
          newEquivalenceRow.push([...statesSubset]);

          continue;
        }
        for (const state of statesSubset) {
          let areStatesEqual = false;

          if (statesSubset[0] !== state) {
            const newStatesSubset =
              newEquivalenceRow[newEquivalenceRow.length - 1];

            const newSubsetState = newStatesSubset[0];

            areStatesEqual = this.areStatesEqual(
              state,
              newSubsetState,
              equivalenceRow,
              originalTable
            );

            if (areStatesEqual) {
              newStatesSubset.push(state);
            }
          }

          if (!areStatesEqual) {
            newEquivalenceRow.push([state]);
          }
        }
      }

      if (
        JSON.stringify(equivalenceArray[equivalenceArray.length - 1]) ===
        JSON.stringify(equivalenceArray[equivalenceArray.length - 2])
      ) {
        break;
      }
    }

    const mapStateToStates = equivalenceArray[
      equivalenceArray.length - 1
    ].reduce((resultMap, states) => {
      resultMap[states[0]] = states;

      return resultMap;
    }, {});

    return Object.entries(originalTable).reduce(
      (resultTable, [rowLabel, columns]) => {
        const stateLabel = rowLabel.replace("*", "").replace("->", "");

        if (mapStateToStates[stateLabel]) {
          const transformedColumns = Object.entries(columns).reduce(
            (resultColumns, [character, state]) => {
              Object.entries(mapStateToStates).forEach(
                ([newState, statesToReplace]) => {
                  if ((statesToReplace as any).includes(String(state))) {
                    resultColumns[character] = newState;
                  }
                }
              );

              if (!resultColumns[character]) {
                resultColumns[character] = null;
              }

              return resultColumns;
            },
            {}
          );

          resultTable[rowLabel] = transformedColumns;
        }

        return resultTable;
      },
      {}
    );
  }
}
