import { charMachine } from '../machines/charMachine';
import { uniteMachines } from '../machines/uniteMachines';
import { EPSILON } from '../machines/epsilonMachine';
import { State } from '../State';
import { NFA } from '../NFA';

describe('NFA', () => {
  let getDefaultNFA;

  beforeAll(() => {
    getDefaultNFA = () => {
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

      return new NFA({ inputState: A, outputState: F });
    };
  });

  it('returns correct alphabet', () => {
    expect(getDefaultNFA().getAlphabet()).toEqual(['y', 'x'])
  })

  describe('alphabet', () => {
    it('returns correct alphabet', () => {
      const aCharMachine = charMachine('a'); 
      const bCharMachine = charMachine('b');
      const cCharMachine = charMachine('c');

      const machine = uniteMachines(
        aCharMachine, 
        bCharMachine, 
        cCharMachine,
      );

      expect(machine.getAlphabet()).toEqual(['c', 'b', 'a'])
    });
  });

  describe('getTransitionTable', () => {
    it('returns correct table', () => {
      expect(getDefaultNFA().getTransitionTable()).toEqual({
        '->q0': {
          x: [],
          y: [],
          'ε*': ['q1', 'q3']
        },

        'q1': {
          x: ['q2'],
          y: [],
          'ε*': [],
        },

        'q2': {
          x: [],
          y: [],
          'ε*': [`q5`],
        },

        'q3': {
          x: [],
          y: ['q4'],
          'ε*': [],
        },

        'q4': {
          x: [],
          y: [],
          'ε*': ['q5'],
        },

        '*q5': {
          x: [],
          y: [],
          'ε*': [],
        },
      });
    });
  });
});
