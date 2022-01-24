import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function getValues() {
    const url = `${AGENT_ENDPOINT}v1/parameters`
    return HttpGet(url, "")
}

export async function updateValues(data) {
    const url = `${AGENT_ENDPOINT}v1/updateparam`
    return HttpPut(url, data)
}
