import {
	jest,
	it,
	expect,
} from '@jest/globals';

import Client, { FetchApi } from '../src/Client';
import ClientContext from '../src/ClientContext';

jest.mock('../src/Client');

const MockedClient = jest.mocked(Client);

const fetch = jest.fn();
const client = new MockedClient('http://local', fetch as unknown as FetchApi);

const storage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
} as unknown as jest.Mocked<Storage>;

const context = new ClientContext(client, storage, 'me');

it('reads a non-existing property from local storage', () => {
	storage.getItem.mockReturnValueOnce(null);
	expect(() => context.readItem('abc')).toThrowError('Failed to read me-abc from local storage.');
	storage.getItem.mockClear();
});

it('reads a property from local storage', () => {
	const value = { a: 1 };
	storage.getItem.mockReturnValueOnce(JSON.stringify(value));
	const res = context.readItem('a');
	expect(res).toStrictEqual(value);
	expect(storage.getItem).toBeCalledWith('me-a');
	storage.getItem.mockClear();
});

it('writes a raw property to local storage', () => {
	context.saveItem('b', 'c');
	expect(storage.setItem).toBeCalledWith('me-b', 'c');
	storage.setItem.mockClear();
});

it('writes a property to local storage', () => {
	context.saveItem('c', { d: true });
	expect(storage.setItem).toBeCalledWith('me-c', '{"d":true}');
	storage.setItem.mockClear();
});

it('deletes a property from local storage', () => {
	context.removeItem('c');
	expect(storage.removeItem).toBeCalledWith('me-c');
	storage.removeItem.mockClear();
});