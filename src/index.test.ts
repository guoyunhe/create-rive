import { createRive } from '.';

describe('createRive', () => {
  describe('normal', async () => {
    expect(createRive('Foo', 'Bar')).toBe('Foo Bar');
  });

  describe('lastName upper case', async () => {
    expect(createRive('Foo', 'Bar', { lastNameUpperCase: true })).toBe('Foo BAR');
  });
});
