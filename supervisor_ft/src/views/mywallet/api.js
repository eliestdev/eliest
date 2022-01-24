


import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function getMyWallet() {
    const url = `${AGENT_ENDPOINT}v1/mywallet`
    return HttpGet(url, "")
}
