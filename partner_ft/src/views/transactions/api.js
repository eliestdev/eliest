import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ADMIN_ENDPOINT

export async function findTransactions(from, to) {
    const url = `${ADMIN_ENDPOINT}v1/transactions?from=${from}&to=${to}`
    return HttpGet(url, "")
}
