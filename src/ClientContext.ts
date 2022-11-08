import Client from './Client';
import ScopedStorage from './ScopedStorage';

export type PropertyParser<PropertyType> = (raw: string) => PropertyType;

interface ContextOptions {
	/**
	 * Session Storage or Local Storage
	 */
	storage: Storage;

	/**
	 * Unique ID used as a prefix in storage
	 */
	id: string;
}

/**
 * A client context.
 * It can send requests and cache data into local storage.
 */
export default class ClientContext {
	protected readonly client: Client;

	protected readonly storage?: ScopedStorage;

	/**
	 * Create a client context.
	 * @param client RESTful client to send HTTP requests.
	 * @param options Extra options
	 */
	constructor(client: Client, options?: ContextOptions) {
		this.client = client;
		if (options) {
			this.storage = new ScopedStorage(options.id, options.storage);
		}
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
