import { NFATable } from '../NFATable';
import { NFA } from '../NFA';
import { State } from '../State';
import { EPSILON } from '../machines/epsilonMachine';


describe('NFATable', () => {
  let getNFATable;

  beforeAll(() => {
    getNFATable = () => {
      const A = new State({ label: 'q0', isStarting: true }); 
      const B = new State({ label: 'q1' }); 
      const C = new State({ label: 'q2' }); 
      const D = new State({ label: 'q3' }); 
      const E = new State({ label: 'q4' }); 
      const F = new State({ label: 'q5', isAccepting: true }); 

      A.addTransitionForSymbol(EPSILON, B);

      B.addTransitionForSymbol('x', C);
      C.addTransitionForSymbol(EPSILON, F);

      A.addTransitionForSymbol(EPSILON, D);
      D.addTransitionForSymbol('y', E);
      E.addTransitionForSymbol(EPSILON, F);

      const nfa = new NFA({ inputState: A, outputState: F });
      
      return new NFATable(nfa);
    };
  });

  describe('create', () => {
    it('returns correct NFA transition table', () => {
      expect(getNFATable().create()).toEqual({
        '->q0': {
          x: [],
          y: [],
          'ε*': ['q0', 'q1', 'q3']
        },

        'q1': {
          x: ['q2'],
          y: [],
          'ε*': ['q1'],
        },

        'q2': {
          x: [],
          y: [],
          'ε*': ['q2','q5'],
        },

        'q3': {
          x: [],
          y: ['q4'],
          'ε*': ['q3'],
        },

        'q4': {
          x: [],
          y: [],
          'ε*': ['q4', 'q5'],
        },

        '*q5': {
          x: [],
          y: [],
          'ε*': ['q5'],
        },
      });
    });
  });

  describe('getStartingState', () => {
    it('returns starting state label', () => {
      const nfaTable = getNFATable(); 

      expect(nfaTable.getStartingState()).toBe('q0');
    });
  });

  describe('getAcceptingState', () => {
    it('returns accepting state label', () => {
      const nfaTable = getNFATable(); 

      expect(nfaTable.getAcceptingState()).toBe('q5');
    });
  });

  describe('getColumns', () => {
    it('returns accepting state label', () => {
      const nfaTable = getNFATable(); 

      expect(nfaTable.getColumns()).toEqual(["y", "x"]);
    });
  });
});
