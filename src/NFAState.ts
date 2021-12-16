import { EPSILON } from "./machines/epsilonMachine";
import { State } from "./State";

export class NFAState extends State {
  /**
   * First of all let's recall what is epsilon
   *   in terms of NFA. Epsilon means present state
   *   can go other state without any input. This can happen
   *   only if epsilon state has epsilon transition to another state.
   *   Epsilon closure is finding all the states which can be reached
   *   from the present state on one or more epsilon transitions.
   *
   * Formal definition: Epsilon (∈) – closure : Epsilon closure for
   *   a given state X is a set of states which can be reached from
   *   the states X with only (null) or ε moves including the state
   *   X itself.
   *
   */
  public getEpsilonClosure(): Array<string | number> {
    /**
     * Any state has epsilon closure to itself.
     *   (there's no need to search for the super logical
     *   explanation of this fact. It's just by definition.
     *   This is the form of an abstraction we should learn
     *   by heart and take into account)..
     */
    const epsilonClosure = new Set<string | number>([this.getLabel()]);

    const getEpsilonClosure = (
      state: State = this,
      visitedStates = new Set<State>()
    ) => {
      const states = state.getTransitionsForSymbol(EPSILON);

      for (const nextState of states) {
        /**
         * The epsilon closure can lead to the state,
         *   that was already visited and included into the
         *   visitedState. In this case we skip this state
         *   in one of the next iterations.
         *
         */
        if (visitedStates.has(nextState)) {
          break;
        }

        visitedStates.add(nextState);

        const stateLabel = nextState.getLabel();

        if (!stateLabel) {
          throw new Error("State should have a label");
        }

        epsilonClosure.add(stateLabel);

        getEpsilonClosure(nextState, visitedStates);
      }
    };

    getEpsilonClosure();

    return Array.from(epsilonClosure);
  }
}
