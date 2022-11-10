import {
	jest,
	it,
	expect,
} from '@jest/globals';

import Client, { FetchApi } from '../src/Client';
import ClientContext from '../src/ClientContext';
import ClientStorage from '../src/ClientStorage';

jest.mock('../src/Client');
jest.mock('../src/ScopedStorage');

const MockedClient = jest.mocked(Client);

const fetch = jest.fn();
const client = new MockedClient('http://local', fetch as unknown as FetchApi);

const context = new ClientContext(client);
const storage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
} as unknown as jest.Mocked<ClientStorage>;
context.setStorage(storage);

it('can return its storage', () => {
	expect(context.getStorage()).toBe(storage);
});

it('reads a non-existing property from local storage', () => {
	storage.getItem.mockReturnValueOnce(null);
	expect(() => context.readItem('abc')).toThrowError('Failed to read abc from local storage.');
	storage.getItem.mockClear();
});

it('reads a property from local storage', () => {
	const value = { a: 1 };
	storage.getItem.mockReturnValueOnce(JSON.stringify(value));
	const res = context.readItem('a');
	expect(res).toStrictEqual(value);
	expect(storage.getItem).toBeCalledWith('a');
	storage.getItem.mockClear();
});

it('writes a raw property to local storage', () => {
	context.saveItem('b', 'c');
	expect(storage.setItem).toBeCalledWith('b', 'c');
	storage.setItem.mockClear();
});

it('writes a property to local storage', () => {
	context.saveItem('c', { d: true });
	expect(storage.setItem).toBeCalledWith('c', '{"d":true}');
	storage.setItem.mockClear();
});

it('deletes a property from local storage', () => {
	context.removeItem('c');
	expect(storage.removeItem).toBeCalledWith('c');
	storage.removeItem.mockClear();
});

it('accepts no storage', () => {
	const me = new ClientContext(client);
	expect(() => me.readItem('k')).toThrowError('The context does not support storage.');
	expect(() => me.removeItem('k')).toThrowError('The context does not support storage.');
	expect(() => me.saveItem('k', 'v')).toThrowError('The context does not support storage.');
});
