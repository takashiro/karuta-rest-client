interface ClientStorage {
	/**
	 * @returns underlying implementation. Usually it's either local storage or session storage.
	 */
	getApi(): Storage;

	/**
	 * Gets an item.
	 * @param key item key
	 * @returns item value
	 */
	getItem(key: string): string | null;

	/**
	 * Remove an item.
	 * @param key item key
	 */
	removeItem(key: string): void;

	/**
	 * Sets an item.
	 * @param key item key
	 * @param value item value
	 */
	setItem(key: string, value: string): void;
}

export default ClientStorage;
