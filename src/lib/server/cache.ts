import { CLEAN_FETCH_TIMER } from '$env/static/private';
import waitUntil from 'async-wait-until';

type FetcherOptions = {
	key: string;
	/** The function to force delete the key from cache */
	remove: (k: string) => boolean;
};

type CacheElement = {
	data?: any;
	fetcher: (options: FetcherOptions) => Promise<any>;
	isFetching: boolean;
	lastUpdate: number;
	ttl: number;
};

const cache: Map<string, CacheElement> = new Map<string, CacheElement>();

const cleaner = setInterval(() => {
	const toDelete = new Set<string>();
	for (const [k, v] of cache) {
		if (!v.isFetching && Date.now() - v.ttl * 2 > v.lastUpdate) toDelete.add(k);
	}
	for (const cacheKey of toDelete) {
		cache.delete(cacheKey);
	}
}, Number.parseInt(CLEAN_FETCH_TIMER));

function _isExpired(el: CacheElement) {
	return !el.isFetching && Date.now() - el.ttl > el.lastUpdate;
}

async function _update(key: string) {
	const value = cache.get(key)!;
	value.isFetching = true;
	let data = await value.fetcher({ key: key, remove: cache.delete });
	value.isFetching = false;
	value.data = data;
	value.lastUpdate = Date.now();
}

/**
 *
 * @param key
 * @param ttl TTL in ms
 * @param fetcher function used to fetch new data from key
 */
async function getOrRevalidate<T>(
	key: string,
	ttl: number = 600 * 1000,
	fetcher?: (options: FetcherOptions) => Promise<T>
): Promise<T> {
	if (cache.get(key) === undefined) {
		const value: CacheElement = {
			fetcher: fetcher ? fetcher : ({ key: key }) => fetch(key).then((r) => r.json()),
			isFetching: false,
			lastUpdate: 0,
			ttl: ttl
		};
		cache.set(key, value);
		await _update(key);
	}
	const value = cache.get(key)!;
	if (_isExpired(value)) await _update(key);
	await waitUntil(() => {
		const val = cache.get(key)
		if (!val) {
			return true;
		}
		return !val.isFetching;
	}, { timeout: 20 * 1000 })
	return value.data;
}

export { getOrRevalidate };
