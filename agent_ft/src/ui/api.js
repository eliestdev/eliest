import { HttpPost } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT

export async function getUser() {
    const url = `${AGENT_ENDPOINT}agent/profile`
    return HttpGet(url, "")
}

export async function activate() {
    const url = `${AGENT_ENDPOINT}agent/activate`
    return HttpPost(url, "")
}

export async function getWallets(user) {
    const url = `${AGENT_ENDPOINT}agent/wallets`
    return HttpGet(url,  "")
}


export async function activateUser() {
    const url = `${AGENT_ENDPOINT}agent/activate`
    return HttpGet(url, "")
}
