// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const newAccount = getBankAccount(2);
    expect(newAccount).not.toBeNull();
    expect(newAccount.getBalance()).toBe(2);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const newAccount = getBankAccount(2);
    expect(() => newAccount.withdraw(3)).toThrowError(
      new InsufficientFundsError(2),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const newAccount = getBankAccount(10);
    const secondAccount = getBankAccount(20);
    expect(() => newAccount.transfer(20, secondAccount)).toThrowError(
      new InsufficientFundsError(10),
    );
  });

  test('should throw error when transferring to the same account', () => {
    const newAccount = getBankAccount(10);
    expect(() => newAccount.transfer(10, newAccount)).toThrowError(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const newAccount = getBankAccount(10);
    newAccount.deposit(10);
    expect(newAccount.getBalance()).toBe(20);
  });

  test('should withdraw money', () => {
    const newAccount = getBankAccount(10);
    newAccount.withdraw(5);
    expect(newAccount.getBalance()).toBeLessThan(10);
  });

  test('should transfer money', () => {
    const newAccount = getBankAccount(30);
    const secondAccount = getBankAccount(20);
    newAccount.transfer(20, secondAccount);
    expect(newAccount.getBalance()).toBe(10);
    expect(secondAccount.getBalance()).toBeGreaterThan(20);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    const account = getBankAccount(30);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(50);
    const balance = await account.fetchBalance();
    expect(balance).not.toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(30);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(50);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(30);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
