import waitUntil from "async-wait-until"

type CacheElement = {
	data?: any,
	fetcher: (key: string) => Promise<any>,
	isFetching: boolean,
	lastUpdate: number,
	ttl: number
}

const cache: { [key: string]: CacheElement } = {}

function _isExpired(el: CacheElement) {
	return !el.isFetching && Date.now() - el.ttl > el.lastUpdate
}

async function _update(key: string) {
	const value = cache[key]
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
	if (cache[key] === undefined) {
		const value: CacheElement = {
			fetcher: fetcher ? fetcher : (key) => fetch(key).then((r) => r.json()),
			isFetching: false,
			lastUpdate: 0,
			ttl: ttl,
		}
		cache[key] = value;
	}
	const value = cache[key]
	if (_isExpired(value))
		_update(key)
	if (value.isFetching)
		await waitUntil(() => !value.isFetching)
	return value.data
}

export { getOrRevalidate }