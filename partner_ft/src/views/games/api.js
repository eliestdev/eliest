import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function games() {
    const url = `${AGENT_ENDPOINT}v1/games`
    return HttpGet(url, "")
}

export async function updategame() {
    const url = `${AGENT_ENDPOINT}v1/games`
    return HttpPut(url, "")
}
