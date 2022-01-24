import { HttpPost } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function login(user) {
    const url = `${AGENT_ENDPOINT}v1/login`
    return HttpPost(url, {...user}, "")
}
