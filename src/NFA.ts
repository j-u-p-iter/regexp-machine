import { State } from "./State";

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

  /**
   * Tests whether this NFA matches the string.
   *   In other words it tests whether this machine
   *   accepts the string or not.
   *   Delegates to the input state.
   *
   */
  test(characters: string) {
    this.inputState.test(characters);
  }
}
