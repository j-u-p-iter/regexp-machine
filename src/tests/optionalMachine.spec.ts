import { charMachine } from '../machines/charMachine';
import { optionalMachine } from '../machines/optionalMachine';


describe('optionalMachine', () => {
  it('works properly', () => {
    const aCharMachine = charMachine('a');

    const machine = optionalMachine(aCharMachine);

    expect(machine.test('')).toBe(true);
    expect(machine.test('a')).toBe(true);
    expect(machine.test('aa')).toBe(false);
    expect(machine.test('b')).toBe(false);
  });
});
