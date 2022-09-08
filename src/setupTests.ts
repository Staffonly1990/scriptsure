// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.matchMedia =
  global.matchMedia ||
  function matchMedia() {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Object.defineProperty(global.document, 'cookie', {
//   writable: true,
//   value: 'connect.sid=test',
// });
