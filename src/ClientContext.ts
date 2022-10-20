import Client from './Client';

export type PropertyParser<PropertyType> = (raw: string) => PropertyType;

/**
 * A client context.
 * It can send requests and cache data into local storage.
 */
export default class ClientContext {
	protected readonly client: Client;

	protected readonly storage: Storage;

	protected readonly id: string;

	/**
	 * Create a client context.
	 * @param client RESTful client to send HTTP requests.
	 * @param id A unique ID to save data into local storage.
	 */
	constructor(client: Client, storage: Storage, id: string) {
		this.client = client;
		this.storage = storage;
		this.id = id;
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
		const key = this.getItemKey(name);
		const data = typeof value === 'string' ? value : JSON.stringify(value);
		this.storage.setItem(key, data);
	}

	/**
	 * Remove a property from local storage.
	 * @param name property name
	 */
	removeItem(name: string): void {
		const itemKey = this.getItemKey(name);
		this.storage.removeItem(itemKey);
	}

	/**
	 * Read a property (raw string) from local storage.
	 * @param name property name
	 * @returns property value
	 */
	readRawItem(name: string): string {
		const key = this.getItemKey(name);
		const raw = this.storage.getItem(key);
		if (raw === null) {
			throw new Error(`Failed to read ${key} from local storage.`);
		}
		return raw;
	}

	protected getItemKey(propertyKey: string): string {
		return `${this.id}-${propertyKey}`;
	}
}
