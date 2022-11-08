import {
	jest,
	it,
	expect,
} from '@jest/globals';

import ScopedStorage from '../src/ScopedStorage';

const api = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
} as unknown as jest.Mocked<Storage>;

const storage = new ScopedStorage('abc', api);

it('has no length', () => {
	expect(() => storage.length).toThrowError('Method not implemented');
});

it('cannot iterate keys', () => {
	expect(() => storage.key()).toThrowError('Method not implemented');
});

it('cannot clear items', () => {
	expect(() => storage.clear()).toThrowError('Method not implemented');
});

it('returns underlying API', () => {
	expect(storage.getApi()).toBe(api);
});

it('saves an item', () => {
	storage.setItem('k', 'v');
	expect(api.setItem).toBeCalledWith('abc-k', 'v');
});

it('gets an item', () => {
	storage.getItem('k');
	expect(api.getItem).toBeCalledWith('abc-k');
});

it('removes an item', () => {
	storage.removeItem('k');
	expect(api.removeItem).toBeCalledWith('abc-k');
});
