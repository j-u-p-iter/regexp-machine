import { EPSILON } from '../machines/epsilonMachine';
import { State } from '../State';
import { DFATable } from '../DFATable';
import { NFATable } from '../NFATable';
import { NFA } from '../NFA';

describe('DFATable', () => {
  let getDFATable;

  beforeAll(() => {
    getDFATable = () => {
      const A = new State({ 
        label: 'q0', 
        isStarting: true,
      });

      const B = new State({ label: 'q1' });

      const C = new State({ label: 'q2' });

      const D = new State({ label: 'q3' });

      const E = new State({ label: 'q4' });

      const F = new State({ label: 'q5', isAccepting: true });

      A.addTransitionForSymbol(EPSILON, B);
      A.addTransitionForSymbol(EPSILON, D);


      B.addTransitionForSymbol('a', C);

      C.addTransitionForSymbol(EPSILON, F);

      D.addTransitionForSymbol('b', E);

      E.addTransitionForSymbol(EPSILON, F);

      const nfa = new NFA({ inputState: A, outputState: F });
      const nfaTable = new NFATable(nfa);
      const dfaTable = new DFATable(nfaTable);

      return dfaTable;
    }
  });

  it('returns correct alphabet', () => {
    const dfaTable = getDFATable();

    expect(dfaTable.create()).toEqual({
      "->q0,q1,q3": {
        a: "q2,q5", 
        b: "q4,q5",
      }, 
      "*q2,q5": {
        a: null, 
        b: null
      }, 
      "*q4,q5": {
        a: null, 
        b: null
      }
    });
  })
});
