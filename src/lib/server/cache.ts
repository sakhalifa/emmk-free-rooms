import waitUntil from "async-wait-until"
import { CLEAN_TIMER } from "$env/static/private"

type CacheElement = {
	data?: any,
	fetcher: (key: string) => Promise<any>,
	isFetching: boolean,
	lastUpdate: number,
	ttl: number
}

const cache: Map<string, CacheElement> = new Map<string, CacheElement>()

const cleaner = setInterval(() => {
	const toDelete = new Set<string>()
	for (const [k, v] of cache) {
		if (!v.isFetching && Date.now() - v.ttl * 2 > v.lastUpdate)
			toDelete.add(k)
	}
	for (const cacheKey of toDelete) {
		cache.delete(cacheKey)
	}
}, Number.parseInt(CLEAN_TIMER))

function _isExpired(el: CacheElement) {
	return !el.isFetching && Date.now() - el.ttl > el.lastUpdate
}

async function _update(key: string) {
	const value = cache.get(key)!
	value.isFetching = true
	let data = await value.fetcher(key)
	value.isFetching = false
	value.data = data
	value.lastUpdate = Date.now()
}

/**
 * 
 * @param key 
 * @param ttl TTL in ms
 * @param fetcher function used to fetch new data from key
 */
async function getOrRevalidate(key: string, ttl: number = 600 * 1000, fetcher?: (key: string) => Promise<any>) {
	if (cache.get(key) === undefined) {
		const value: CacheElement = {
			fetcher: fetcher ? fetcher : (key) => fetch(key).then((r) => r.json()),
			isFetching: false,
			lastUpdate: 0,
			ttl: ttl,
		}
		cache.set(key, value);
	}
	const value = cache.get(key)!
	if (_isExpired(value))
		_update(key)
	if (value.isFetching)
		await waitUntil(() => !value.isFetching)
	return value.data
}

export { getOrRevalidate }