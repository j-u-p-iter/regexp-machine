import { EPSILON } from "./machines/epsilonMachine";

interface StateOptions {
  isAccepting?: boolean;
}

/**
 * Class to create state, which is one of the
 *   building blocks of a state machine.
 *
 * Each state machine has one initial state,
 *   and can have one or more accepting states.
 *
 */
export class State {
  private transitionsMap: Map<string, State[]>;

  constructor({ isAccepting = false }: StateOptions = {}) {
    this.isAccepting = isAccepting;
    /**
     * In case of NFA the transition can be done
     *   to multiple next states on one symbol.
     *   This is why we map array of states to each symbol,
     *   but not just one state.
     */
    this.transitionsMap = new Map<string, State[]>();
  }

  public isAccepting: boolean;

  public addTransitionForSymbol(symbol: string, state: State): void {
    const currentTransitionForSymbol: State[] =
      this.transitionsMap.get(symbol) || [];

    currentTransitionForSymbol.push(state);

    this.transitionsMap.set(symbol, currentTransitionForSymbol);
  }

  public getTransitionsForSymbol(symbol: string): State[] {
    return this.transitionsMap.get(symbol) || [];
  }

  /**
   * Every epsilon NFA machine (complex and simple) has starting state.
   *   We always start traversing the whole epsilon NFA machine graph, starting
   *   from this state. Each state except the accepting, including the starting one,
   *   contains at least one transition to another state: one on the symbol and/or one epsilon.
   *
   *   NFA is actually a graph of nodes we can traverse through (starting from the root).
   *   This method is exactly traversing the graph. Reaching each state it checks:
   *
   *   - if the checking string is not empty.
   *     If the string is empty and if the state is accepting - we can say,
   *     that the whole string is accepting and the string satisfies the state machine.
   *     If the string is empty but the state is not accepting, probably there're epsilon transitions
   *     from the current state to the accepging state. So, we try to iterate through epsilon tranitions if there're.
   *     If there're no epsilon transitions we return false.
   *
   *   - if there are epsilon transitions for the state. In this case we chould just traverse further to the
   *     next state, passing the whole string further.
   *
   *
   */
  public test(characters: string) {
    if (characters.length === 0) {
      /**
       * To resolve the string as accepting
       *   the incoming string should be empty.
       *   Otherwise:
       *
       *   - there's probably epsilon transition back to
       *     the previous NFA fragment.
       *
       *   - or probably the string is not accepted,
       *     cause there're more characters, that should
       *     be consumed by machine until the string being
       *     resolved as accepted. In this case the string is
       *     not accepted by machine.
       */
      if (this.isAccepting) {
        /**
         * This is the final destination point.
         *   For every string, accepted by machine.
         */
        return true;
      }

      /**
       * Go to the deeper states to continue traversing
       *   on epsilon transitions. Maybe there're epsilon transition
       *   that leads from the current state to the accepting once.
       *
       */
      for (const nextState of this.getTransitionsForSymbol(EPSILON)) {
        /**
         * It's not necessary all states to return true in this case.
         *   But instead it's enough at least one state return true,
         *   cause there multiple potential branches (NFA fragments),
         *   that could be tested by machine. If at least one of the
         *   fragments lead to accepting state on the last string symbol -
         *   the string is resolved as accepted.
         *
         */
        if (nextState.test("")) {
          return true;
        }
      }

      return false;
    }

    for (const nextState of this.getTransitionsForSymbol(EPSILON)) {
      if (nextState.test(characters)) {
        return true;
      }
    }

    const currentSymbol = characters[0];
    const restCharacters = characters.slice(1);

    /**
     * Go the the deeper states to continue traversing
     *   on other transitions.
     *
     */
    for (const nextState of this.getTransitionsForSymbol(currentSymbol)) {
      if (nextState.test(restCharacters)) {
        return true;
      }
    }

    /**
     * If we reached this point, than there're not transitions
     *   for the current symbol. As result, the string is not accepted.
     *
     */
    return false;
  }
}
