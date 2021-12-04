import { charMachine } from '../machines/charMachine';
import { uniteMachines } from '../machines/uniteMachines'; 


describe('uniteMachines', () => {
  it.only('works properly', () => {
    const aCharMachine = charMachine('a'); 
    const bCharMachine = charMachine('b');
    const cCharMachine = charMachine('c');

    const abcUniteMachine = uniteMachines(
      aCharMachine, 
      bCharMachine, 
      cCharMachine,
    );

    expect(abcUniteMachine.test('a')).toBe(true);
    expect(abcUniteMachine.test('b')).toBe(true);
    expect(abcUniteMachine.test('c')).toBe(true);
    expect(abcUniteMachine.test('e')).toBe(false);
    expect(abcUniteMachine.test('f')).toBe(false);
  });
});
