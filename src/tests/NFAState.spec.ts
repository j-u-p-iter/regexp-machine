import { NFAState } from '../NFAState';
import { EPSILON } from '../machines/epsilonMachine';

describe('NFAState', () => {
  it('getEpsilonClosure', () => {
    const A = new NFAState({ label: 'q0' });
    const B = new NFAState({ label: 'q1' });
    const C = new NFAState({ label: 'q2' });
    const D = new NFAState({ label: 'q3' });
    const F = new NFAState({ label: 'q4' });
    const M = new NFAState({ label: 'q5' });

    A.addTransitionForSymbol(EPSILON, B);
    B.addTransitionForSymbol(EPSILON, C);
    C.addTransitionForSymbol(EPSILON, D);
    D.addTransitionForSymbol(EPSILON, F);
    A.addTransitionForSymbol('m', M);

    const epsilonClosure = A.getEpsilonClosure();

    expect(epsilonClosure).toEqual(['q0', 'q1', 'q2', 'q3', 'q4']);
  });
});
