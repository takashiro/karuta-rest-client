export type FetchApi = typeof window.fetch;

export const enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Delete = 'DELETE',
	Head = 'HEAD',
	Put = 'PUT',
	Patch = 'PATCH',
}

/**
 * A RESTful Client.
 */
export default class Client {
	protected rootUrl: string;

	protected fetch: FetchApi;

  /**
   * Create a client of a RESTful API server.
   * @param rootUrl Root URL of RESTful API (Do not end it with /)
   * @param fetch Fetch API (It should be window.fetch in browser context)
   */
	constructor(rootUrl: string, fetch: FetchApi) {
		this.rootUrl = rootUrl;
		this.fetch = fetch;
	}

  /**
   * Send a GET request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	get(context?: string, options?: RequestInit): Promise<Response> {
		return this.request(HttpMethod.Get, context, options);
	}

  /**
   * Send a POST request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	post(context?: string, options?: RequestInit): Promise<Response> {
		return this.request(HttpMethod.Post, context, options);
	}

  /**
   * Send a DELETE request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	delete(context?: string, options?: RequestInit): Promise<Response> {
		return this.request(HttpMethod.Delete, context, options);
	}

  /**
   * Send a request.
   * @param method HTTP method
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	request(method: HttpMethod, context?: string, options?: RequestInit): Promise<Response> {
		const url = this.getContext(context);
		const init: RequestInit = {
			...options,
			method,
		};
		return this.fetch(url, init);
	}

  /**
   * Create a child client of more specific context path.
   * @param context context path
   * @returns A child client
   */
	derive(context: string): Client {
		return new Client(this.getContext(context), this.fetch);
	}

  protected getContext(context?: string): string {
    if (context) {
      return `${this.rootUrl}/${context}`;
    }
    return this.rootUrl;
  }
}
