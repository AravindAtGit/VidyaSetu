import { load, save } from './storage';

const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('Storage Utilities', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('load returns fallback when there is no data', () => {
    const result = load('testKey', ['default']);
    expect(result).toEqual(['default']);
  });

  test('save stores data in localStorage', () => {
    save('testKey', [1, 2, 3]);
    const result = load('testKey', []);
    expect(result).toEqual([1, 2, 3]);
  });

  test('load returns parsed data', () => {
    localStorage.setItem('testKey', JSON.stringify([4, 5, 6]));
    const result = load('testKey', []);
    expect(result).toEqual([4, 5, 6]);
  });

  test('load handles invalid JSON gracefully', () => {
    localStorage.setItem('testKey', 'invalidJSON');
    const result = load('testKey', ['fallback']);
    expect(result).toEqual(['fallback']);
  });
});

