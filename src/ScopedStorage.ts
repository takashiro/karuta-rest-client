export default class ScopedStorage implements Storage {
	protected readonly prefix: string;

	protected readonly api: Storage;

	constructor(prefix: string, api: Storage) {
		this.prefix = prefix;
		this.api = api;
	}

	getApi(): Storage {
		return this.api;
	}

	get length(): number { // eslint-disable-line class-methods-use-this
		throw new Error('Method not implemented');
	}

	key(): string | null { // eslint-disable-line class-methods-use-this
		throw new Error('Method not implemented.');
	}

	clear(): void { // eslint-disable-line class-methods-use-this
		throw new Error('Method not implemented.');
	}

	getItem(key: string): string | null {
		return this.api.getItem(this.getScopedKey(key));
	}

	removeItem(key: string): void {
		this.api.removeItem(this.getScopedKey(key));
	}

	setItem(key: string, value: string): void {
		this.api.setItem(this.getScopedKey(key), value);
	}

	protected getScopedKey(key: string): string {
		return `${this.prefix}-${key}`;
	}
}
