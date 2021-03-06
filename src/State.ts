import { EPSILON } from "./machines/epsilonMachine";

interface StateOptions {
  isAccepting?: boolean;
  isStarting?: boolean;
  label?: string | number;
}

type TransitionCharacter = string;

const flattenArray = map => {
  return map.reduce((resultMap, item) => {
    return [...resultMap, ...item];
  }, []);
};

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

  /**
   * State identifier to use in transition table, for example.
   *
   *   It's not necessary to set up
   *   label for the State (this is why this parameter
   *   is optional). But it makes the visualisation
   *   of state machine more clear and precise if
   *   it's set up.
   *
   *   On the step of creation transition tables and
   *   graphs the label for the State the table/graph
   *   contains is set up aumatically (if there's no predefined label
   *   for it).
   *
   */
  private label: string | number;

  constructor({
    isStarting = false,
    isAccepting = false,
    label = ""
  }: StateOptions = {}) {
    this.isAccepting = isAccepting;
    this.isStarting = isStarting;
    this.label = label;
    /**
     * In case of NFA the transition can be done
     *   to multiple next states on one symbol.
     *   This is why we map array of states to each symbol,
     *   but not just one state.
     */
    this.transitionsMap = new Map<TransitionCharacter, State[]>();
  }

  public isAccepting: boolean;

  public isStarting: boolean;

  public setLabel(label: string | number): void {
    this.label = label;
  }

  public getLabel(): string | number {
    return this.label;
  }

  public getAllTransitions(): Map<string, State[]> {
    return this.transitionsMap;
  }

  public getAllTransitionsStates(): State[] {
    return flattenArray(Array.from(this.getAllTransitions().values()));
  }

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
  public test(characters: string, visitedStates = new Map()) {
    /**
     * It's possible to fall into infinite recursion,
     *   when you transit between the same states with help
     *   of epsilon transitions.
     *
     * Firs of all it's normal to comeback to the same state
     *   on epsilon transition. But it's not normal if you
     *   come to the same state with the same set of characters.
     *   If it happens it means that you're moving between the same multiple
     *   states on epsilon transitions. As result we need to break such type
     *   of transitions not to fall into infinite loop.
     *
     */
    if (visitedStates.get(this) === characters) {
      return false;
    }

    visitedStates.set(this, characters);

    if (characters.length === 0) {
      /**
       * To resolve the string as accepting
       *   the incoming string should be empty.
       *   Otherwise:
       *
       *   - there's probably epsilon transition back to
       *     the previous NFA fragment;
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
        if (nextState.test("", visitedStates)) {
          return true;
        }
      }

      return false;
    }

    const currentSymbol = characters[0];
    const restCharacters = characters.slice(1);

    /**
     * Go the the deeper states to continue traversing
     *   on other transitions.
     *
     */
    for (const nextState of this.getTransitionsForSymbol(currentSymbol)) {
      if (nextState.test(restCharacters, visitedStates)) {
        return true;
      }
    }

    for (const nextState of this.getTransitionsForSymbol(EPSILON)) {
      if (nextState.test(characters, visitedStates)) {
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
