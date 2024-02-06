import {
	jest,
	it,
	expect,
	afterEach,
} from '@jest/globals';

import Client, { FetchApi } from '../src/Client.js';

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

it('sends a request in JSON format', async () => {
	const query = { x: '3', y: false, z: 4 };
	const data = { a: 1, b: 2 };
	await client.post('room', { query, data });
	expect(fetch).toBeCalledWith('http://example.com/api/room?x=3&y=false&z=4', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(data),
	});
});

it('sends a JSON request with Headers', async () => {
	const data = { a: 1 };
	const headers = new Headers({ 'accept-language': 'zh-CN' });
	await client.patch('room', { data, headers });
	expect(fetch).toBeCalledWith('http://example.com/api/room', {
		method: 'PATCH',
		headers: new Headers({
			'accept-language': 'zh-CN',
			'content-type': 'application/json',
		}),
		body: JSON.stringify(data),
	});
});

it('sends a JSON request with array-like headers', async () => {
	const data = { a: 1 };
	const headers: [string, string][] = [['accept-language', 'zh-CN']];
	await client.patch('room', { data, headers });
	expect(fetch).toBeCalledWith('http://example.com/api/room', {
		method: 'PATCH',
		headers: [
			['accept-language', 'zh-CN'],
			['content-type', 'application/json'],
		],
		body: JSON.stringify(data),
	});
});

it('sends a request with URLSearchParams', async () => {
	const query = new URLSearchParams({ a: 'b' });
	await client.get('players', { query });
	expect(fetch).toBeCalledWith('http://example.com/api/players?a=b', { method: 'GET' });
});
