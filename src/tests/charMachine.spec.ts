import { charMachine } from '../machines/charMachine';

describe('charMachine', () => {
  it('works properly', () => {
    const machine = charMachine('a');

    expect(machine.test('a')).toBe(true);
    expect(machine.test('b')).toBe(false);
    expect(machine.test('')).toBe(false);
  });
});
