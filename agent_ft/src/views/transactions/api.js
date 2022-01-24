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

export async function findTransactions(account) {
    const url = `${TRANSACTION_ENDPOINT}get-transactions?account=${account}`
    return HttpGet(url, "")
}

export async function sendVtu(vtu) {
    const url = `${AGENT_ENDPOINT}agent/vtu`
    return HttpPost(url, vtu)
}

export async function winCode(win) {
    const url = `${AGENT_ENDPOINT}agent/wincode`
    return HttpPost(url, win)
}

export async function toBank(vtu) {
    const url = `${AGENT_ENDPOINT}agent/vtu`
    return HttpPost(url, vtu)
}

export async function verifyNuban(data) {
    const url = `${AGENT_ENDPOINT}agent/withdraw`
    return HttpPost(url, data)
}

export async function withdrawNuban(data) {
    const url = `${AGENT_ENDPOINT}agent/pay`
    return HttpPost(url, data)
}

