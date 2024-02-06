import Client from './Client.js';
import ClientStorage from './ClientStorage.js';

export type PropertyParser<PropertyType> = (raw: string) => PropertyType;

/**
 * A client context.
 * It can send requests and cache data into local storage.
 */
export default class ClientContext {
	protected readonly client: Client;

	protected storage?: ClientStorage;

	/**
	 * Create a client context.
	 * @param client RESTful client to send HTTP requests.
	 */
	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * @returns a storage to save cache.
	 */
	getStorage(): ClientStorage | undefined {
		return this.storage;
	}

	/**
	 * Sets a storage to save cache.
	 * @param storage data storage
	 */
	setStorage(storage: ClientStorage) {
		this.storage = storage;
	}

	/**
	 * Read a property from local storage.
	 * @param name property name
	 * @returns property value
	 */
	readItem<PropertyType>(name: string): PropertyType {
		const raw = this.readRawItem(name);
		return JSON.parse(raw) as PropertyType;
	}

	/**
	 * Save a property into local storage.
	 * @param name property name
	 * @param value property value
	 */
	saveItem(name: string, value: unknown): void {
		if (!this.storage) {
			throw new Error('The context does not support storage.');
		}
		const data = typeof value === 'string' ? value : JSON.stringify(value);
		this.storage.setItem(name, data);
	}

	/**
	 * Remove a property from local storage.
	 * @param name property name
	 */
	removeItem(name: string): void {
		if (!this.storage) {
			throw new Error('The context does not support storage.');
		}
		this.storage.removeItem(name);
	}

	/**
	 * Read a property (raw string) from local storage.
	 * @param name property name
	 * @returns property value
	 */
	readRawItem(name: string): string {
		if (!this.storage) {
			throw new Error('The context does not support storage.');
		}
		const raw = this.storage.getItem(name);
		if (raw === null) {
			throw new Error(`Failed to read ${name} from local storage.`);
		}
		return raw;
	}
}
