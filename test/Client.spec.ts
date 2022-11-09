import {
	jest,
	it,
	expect,
	afterEach,
} from '@jest/globals';

import Client, { FetchApi } from '../src/Client';

const fetch = jest.fn();
const client = new Client('http://example.com/api', fetch as unknown as FetchApi);

afterEach(() => {
	fetch.mockClear();
});

it('sends GET request', async () => {
	await client.get('status');
	expect(fetch).toBeCalledWith('http://example.com/api/status', { method: 'GET' });
});

it('sends POST request', async () => {
	const headers = {
		'Accept-Language': 'zh-cn',
	};
	await client.post('room', { headers });
	expect(fetch).toBeCalledWith('http://example.com/api/room', { method: 'POST', headers });
});

it('sends DELETE request', async () => {
	await client.delete('room/1');
	expect(fetch).toBeCalledWith('http://example.com/api/room/1', { method: 'DELETE' });
});

it('derives a child client', async () => {
	const room = client.derive('room/1');
	await room.get('status');
	expect(fetch).toBeCalledWith('http://example.com/api/room/1/status', { method: 'GET' });
});

it('gets root context by default', async () => {
	await client.get();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'GET' });
});

it('gets meta of root context by default', async () => {
	await client.head();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'HEAD' });
});

it('posts root context by default', async () => {
	await client.post();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'POST' });
});

it('delete root context by default', async () => {
	await client.delete();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'DELETE' });
});

it('puts root context by default', async () => {
	await client.put();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'PUT' });
});

it('patches root context by default', async () => {
	await client.patch();
	expect(fetch).toBeCalledWith('http://example.com/api', { method: 'PATCH' });
});
