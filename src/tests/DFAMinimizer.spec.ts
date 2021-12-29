import { DFAMinimizer } from '../DFAMinimizer';

describe('DFAMinimizer', () => {
  describe('dfaMinimizer.minimize', () => {
    it('returns correct states', () => {
      const dfaMinimizer = new DFAMinimizer();

      expect(dfaMinimizer.minimize({
        "->1": { a: "2" },                                                                                                        
        "*2": { a: "3" },                                                                                                        
        "*3": { a: "3" },                                                                                                        
      })).toEqual({
        "->1": {
          a: "2", 
        }, 
        "*2": {
          a: "2", 
        }
      });
    });
  });

  describe('dfaMinimizer.minimize', () => {
    it('returns correct states', () => {
      const dfaMinimizer = new DFAMinimizer();

      expect(dfaMinimizer.minimize({
        "->1": {a: "3"},
        "*2": {},
        "3": {b: "2"},
      })).toEqual({
        "->1": { a: "3"}, 
        "*2": {},
        "3": { b: "2" }
      });
    });
  });

  describe('dfaMinimizer.minimize', () => {
    it('returns correct states', () => {
      const dfaMinimizer = new DFAMinimizer();

      expect(dfaMinimizer.minimize({
        "*1": {a: "2"},
        "*2": {a: "2"},
      })).toEqual({
        "*1": { a: "1"}, 
      });
    });
  });

  describe('dfaMinimizer.minimize', () => {
    it('returns correct states', () => {
      const dfaMinimizer = new DFAMinimizer();

      expect(dfaMinimizer.minimize({
        "->1": { a: "5", b: "4", c: "3", d: "2" },
        "*2": { a: null, b: null, c: null, d: null },
        "*3": { a: null, b: null, c: null, d: null },
        "*4": { a: null, b: null, c: null, d: null },
        "*5": { a: null, b: null, c: null, d: null },
      })).toEqual({
        "->1": { a: "2", b: "2", c: "2", d: "2" },
        "*2": { a: null, b: null, c: null, d: null },
      });
    });
  });

  describe('dfaMinimizer.minimize', () => {
    it('returns correct states', () => {
      const dfaMinimizer = new DFAMinimizer();

      expect(dfaMinimizer.minimize({
        "->q0": { a: "q1", b: "q2" },
        "q1": { a: "q1", b: "q3" },
        "q2": { a: "q1", b: "q2" },
        "q3": { a: "q1", b: "q4" },
        "*q4": { a: "q1", b: "q2" },
      })).toEqual({
        "->q0": { a: "q1", b: "q0" },
        "q1": { a: "q1", b: "q3" },
        "q3": { a: "q1", b: "q4" },
        "*q4": { a: "q1", b: "q0" },
      });
    });
  });
});
