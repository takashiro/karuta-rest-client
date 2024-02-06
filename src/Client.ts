export type FetchApi = typeof window.fetch;

export const enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Delete = 'DELETE',
	Head = 'HEAD',
	Put = 'PUT',
	Patch = 'PATCH',
}

export type Query = Record<string, string | number | boolean> | URLSearchParams;

export interface RequestOptions extends Omit<RequestInit, 'method'> {
  /**
   * The parameters here will be appended to the context path.
   */
  query?: Query;

  /**
   * The object here will be serialized into JSON format.
   * (This implies Content-Type: application/json)
   */
  data?: unknown;
}

function createQuery(query?: Query): string {
  if (!query) {
    return '';
  }

  if (query instanceof URLSearchParams) {
    return query.toString();
  }

  const init: Record<string, string> = Object.entries(query)
    .map(([k, v]) => ([k, typeof v === 'string' ? v : String(v)]))
    .reduce((prev, [k, v]) => {
      prev[k] = v;
      return prev;
    }, {} as Record<string, string>);
  return new URLSearchParams(init).toString();
}

function addHeader(headers: HeadersInit, field: string, value: string): void {
  if (headers instanceof Headers) {
    headers.append(field, value);
  } else if (Array.isArray(headers)) {
    headers.push([field, value]);
  } else {
    headers[field] = value;
  }
}

function createOptions(method: HttpMethod, { data, ...options }: Omit<RequestOptions, 'query'>): RequestInit {
  const init: RequestInit = { ...options };
  init.method = method;

  if (data) {
    const { headers = {} } = init;
    addHeader(headers, 'content-type', 'application/json');
    init.headers = headers;
    init.body = JSON.stringify(data);
  }

  return init;
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
	get(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Get, context, options);
	}

  /**
   * Send a HEAD request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	head(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Head, context, options);
	}

  /**
   * Send a POST request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	post(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Post, context, options);
	}

  /**
   * Send a DELETE request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	delete(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Delete, context, options);
	}

  /**
   * Send a PUT request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	put(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Put, context, options);
	}

  /**
   * Send a Patch request.
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	patch(context?: string, options?: RequestOptions): Promise<Response> {
		return this.request(HttpMethod.Patch, context, options);
	}

  /**
   * Send a request.
   * @param method HTTP method
   * @param context context path
   * @param options request options
   * @returns HTTP response
   */
	request(
    method: HttpMethod,
    context?: string,
    { query, ...options }: RequestOptions = {},
  ): Promise<Response> {
    const queryStr = createQuery(query);
		const url = this.getContext(context) + (queryStr ? `?${queryStr}` : '');
    const init = createOptions(method, options);
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
