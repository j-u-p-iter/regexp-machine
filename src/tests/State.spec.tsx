import { State } from '../State';

describe('State', () => {
  it('is not accepting by default', () => {
    const state = new State();

    expect(state.isAccepting).toBe(false);
  });

  describe('with "isAccepting" equals to false', () => {
    it('is not accepting', () => {
      const state = new State({ isAccepting: true });

      expect(state.isAccepting).toBe(true);
    });
  });

  describe('transitions', () => {
    it('adds transitions for symbol', () => {
      const state1 = new State();
      const state2 = new State();
      const state3 = new State();

      state1.addTransitionForSymbol('a', state2);

      expect(state1.getTransitionForSymbol('a')).toEqual([state2]);
      
      state1.addTransitionForSymbol('a', state3);

      expect(state1.getTransitionForSymbol('a')).toEqual([state2, state3]);
    });
  });
});
