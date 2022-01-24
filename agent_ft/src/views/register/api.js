import { HttpPost } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT

export async function register(user) {
    const url = `${AGENT_ENDPOINT}register`
    return HttpPost(url, {...user}, "")
}
