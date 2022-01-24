import { HttpPost } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT
//TODO Make this call via service 
const TRANSACTION_ENDPOINT = process.env.REACT_APP_TRANSACTION_ENDPOINT

export async function getWallets(user) {
    const url = `${AGENT_ENDPOINT}agent/wallets`
    return HttpGet(url,  "")
}

export async function findWallet(id) {
    const url = `${AGENT_ENDPOINT}agent/get-wallet?id=${id}`
    return HttpGet(url, "")
}

export async function getGames() {
    const url = `${AGENT_ENDPOINT}agent/activate`
    return HttpPost(url, "")
}