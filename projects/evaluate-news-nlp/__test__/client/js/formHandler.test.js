import {handleSubmit} from './../../../src/client/js/formHandler';

test('handleSubmit should be defined', () => {
  expect(handleSubmit).toBeDefined();
});

test('handleSubmit should be read-only', () => {
  expect(() => {
    handleSubmit = 'foo';
  }).toThrow('"handleSubmit" is read-only.');
});
