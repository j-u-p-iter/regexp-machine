import { charMachine } from '../machines/charMachine';
import { repetitionMachine } from '../machines/repetitionMachine';


describe('repetitionMachine', () => {
  it('works properly', () => {
    const aCharMachine = charMachine('a');
    const machine = repetitionMachine(aCharMachine);

    //expect(machine.test('')).toBe(true);
    //expect(machine.test('a')).toBe(true);
    expect(machine.test('aa')).toBe(true);
    //expect(machine.test('aaaaaaaaaa')).toBe(true);
    //expect(machine.test('b')).toBe(false);
    //expect(machine.test('ab')).toBe(false);
  });
});
