import { charMachine } from '../machines/charMachine';
import { concatMachines } from '../machines/concatMachines';


describe('concatMachine', () => {
  it('works properly', () => {
    const aCharMachine = charMachine('a'); 
    const bCharMachine = charMachine('b');

    const abConcatMachine = concatMachines(aCharMachine, bCharMachine);

    expect(abConcatMachine.test('ab')).toBe(true);
    expect(abConcatMachine.test('aa')).toBe(false);
    expect(abConcatMachine.test('bb')).toBe(false);
    expect(abConcatMachine.test('ba')).toBe(false);
  });
});
