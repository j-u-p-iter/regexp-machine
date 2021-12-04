import { charMachine } from '../machines/charMachine';
import { plusMachine } from '../machines/plusMachine';

describe('plusMachine', () => {
  it('works properly', () => {
    const aCharMachine = charMachine('a'); 

    const aPlusMachine = plusMachine(aCharMachine);

    expect(aPlusMachine.test('')).toBe(false);
    expect(aPlusMachine.test('a')).toBe(true);
    expect(aPlusMachine.test('aa')).toBe(true);
    expect(aPlusMachine.test('aaaaaaa')).toBe(true);
  });
});
