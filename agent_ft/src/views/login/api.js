import { HttpPost } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT

export async function login(user) {
    const url = `${AGENT_ENDPOINT}login`
    return HttpPost(url, {...user}, "")
}
