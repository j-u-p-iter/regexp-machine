import { EPSILON } from "./epsilonMachine";
import { NFA } from "./NFA";
import { State } from "./State";
/***
 * The helper is used to unite
 *   two machines together ("or" operator). These can be
 *   any machines - simplest building blocks,
 *   or very complex machines, consisted of
 *   multiple simplest building blocks.
 *
 * firstMachine and secondMachine can be any complex or simplest machine.
 *
 * As result we create an NFA machines, which consists of
 *   two possible branches to go - to machines to go.
 *   The transition to each of this machine is happening
 *   though the epsilon transition.
 *   The string to satisfy the result machine should satisfy
 *   one of the branches - one of the united together machines
 *   (this is how "or" operator works).
 *
 *   As result the united machines pair has one common input state and one common output state.
 *
 *   And, there're two epsilon transitions from one common input
 *     state to the input state of each united machine.
 *
 *   Also, there're two epsilon transitions from output states of both machines
 *     to one common output state, which is the only
 *     accepting state in the whole result united NFA tree.
 *
 */
export const unitePair = (firstMachine: NFA, secondMachine: NFA): NFA => {
  /**
   * Non of the output states of united machines
   *   can be considered as accepted, cause the
   *   accepted state of each of our building block (NFA fragment)
   *   should be only one. The output states of both united machines
   *   will transit to the final common accepted state with epsilon
   *   transition.
   *
   */
  firstMachine.outputState.isAccepting = false;
  secondMachine.outputState.isAccepting = false;

  const initialState = new State();

  initialState.addTransitionForSymbol(EPSILON, firstMachine.inputState);

  initialState.addTransitionForSymbol(EPSILON, secondMachine.inputState);

  const acceptedState = new State({
    isAccepting: true
  });

  firstMachine.outputState.addTransitionForSymbol(EPSILON, acceptedState);

  secondMachine.outputState.addTransitionForSymbol(EPSILON, acceptedState);

  return new NFA({ inputState: initialState, outputState: acceptedState });
};

/**
 * Sequentially unites machines, building
 *   the next machine on top of the previous one,
 *   adding one common input state and one common
 *   output state for all machines.
 *
 */
export const uniteMachines = (machines: NFA[]): NFA => {
  const restMachines = machines.slice(1);

  let nextMachine = machines[0];

  for (const machine of restMachines) {
    nextMachine = unitePair(nextMachine, machine);
  }

  return nextMachine;
};
