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

  public getTransitionForSymbol(symbol: string): State[] {
    return this.transitionsMap.get(symbol);
  }

  public test(characters: string) {
    return Boolean(characters);
  }
}
