import * as qs from 'querystring'

export function parseSearch (search) {
    return qs.parse(search.slice(1))
}
