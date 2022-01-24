import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL


export async function findTransactions(from, to) {
    const url = `${ADMIN_ENDPOINT}v1/finance?from=${from}&to=${to}`
    return HttpGet(url, "")
}