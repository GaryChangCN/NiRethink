import * as qs from 'querystring'

export function parseSearch (search): {
    [prop: string]: any
} {
    if (!search) {
        return {}
    }
    return qs.parse(search.slice(1))
}
