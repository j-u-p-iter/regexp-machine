import { EPSILON } from "./epsilonMachine";
import { NFA } from "./NFA";

/***
 * The helper is used to concatenate
 *   two machines together. These can be
 *   any machines - simplest building blocks,
 *   or very complex machines, consisted of
 *   multiple simplest building blocks.
 *
 * firstMachine and secondMachine can be any complex or simplest machine.
 *
 * As result we create an NFA machines, which connects the inputState of the
 *   first machine to the outputState of the second machine:
 *
 *   - adding first machine input state as the input state of the result machine;
 *
 *   - adding second machine output state as the output state of the result machine;
 *
 *   - adding epsilon transition between output state of the first machine and input
 *     state of the second machine.
 */
export const concatPair = (firstMachine: NFA, secondMachine: NFA): NFA => {
  firstMachine.outputState.isAccepting = false;
  secondMachine.outputState.isAccepting = true;

  /**
   * Every node in NFA state machine knows about
   *   all possible transitions that can be done,
   *   and about symbols, that lead to such transitions.
   */
  firstMachine.outputState.addTransitionForSymbol(
    EPSILON,
    secondMachine.inputState
  );

  return new NFA({
    inputState: firstMachine.inputState,
    outputState: secondMachine.outputState
  });
};

/**
 * Sequentially concatenates machines, building
 *   the next machine on top of the previous one,
 *   chaining input and output states of each
 *   machine together.
 *
 */
export const concatMachines = (machines: NFA[]): NFA => {
  const restMachines = machines.slice(1);

  let nextMachine = machines[0];

  for (const machine of restMachines) {
    nextMachine = concatPair(nextMachine, machine);
  }

  return nextMachine;
};
