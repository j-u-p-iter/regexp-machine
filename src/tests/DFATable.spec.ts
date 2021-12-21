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

  describe('dfaTable.getOriginalTable', () => {
    it('returns correct table', () => {
      const dfaTable = getDFATable();

      expect(dfaTable.getOriginalTable()).toEqual({
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
  })

  describe('dfaTable.getTableWithMergedLabels', () => {
    it('returns correct table', () => {
      const dfaTable = getDFATable();

      expect(dfaTable.getTableWithMergedLabels()).toEqual({
        "->q0": {
          a: "q2", 
          b: "q1",
        }, 
        "*q1": {
          a: null, 
          b: null
        }, 
        "*q2": {
          a: null, 
          b: null
        }
      });
    })
  })
});
