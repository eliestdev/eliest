import { HttpPost } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL
const ADMIN_ENDPOINT = process.env.REACT_APP_ADMIN_URL

export async function getUser() {
    const url = `${AGENT_ENDPOINT}v1/profile`
    return HttpGet(url, "")
}


export async function getValues() {
    const url = `${ADMIN_ENDPOINT}v1/parameters`
    return HttpGet(url, "")
}