// import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(() => console.log('mocked foo')),
    mockTwo: jest.fn(() => console.log('mocked bar')),
    mockThree: jest.fn(() => console.log('mocked baz')),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const { mockOne, mockTwo, mockThree } = require('./index');
    mockOne();
    mockTwo();
    mockThree();
    expect(mockOne).toHaveBeenCalled();
    expect(mockTwo).toHaveBeenCalled();
    expect(mockThree).toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const { unmockedFunction } = require('./index');
    console.log = jest.fn();
    unmockedFunction();
    expect(console.log).toHaveBeenCalledWith('I am not mocked');
  });
});
