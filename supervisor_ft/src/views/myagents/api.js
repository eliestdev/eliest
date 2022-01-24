import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const FINANCE_ENDPOINT = process.env.REACT_APP_FINANCE_URL
const AGENT_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function getAgents() {
    const url = `${AGENT_ENDPOINT}v1/myagents`
    return HttpGet(url, "")
}

export async function getAgent(id) {
    const url = `${AGENT_ENDPOINT}v1/myagents/${id}`
    return HttpGet(url, "")
}

export async function getWallets(id) {
    const url = `${FINANCE_ENDPOINT}find-wallets?owner=${id}&title=Funded Wallet`
    return HttpGet(url, "")
}

export async function getWallet(id) {
    const url = `http://localhost:6001/agent/get-wallet?id=${id}`
    return HttpGet(url, "")
}

export async function getTransaction(id) {
    const url = `${FINANCE_ENDPOINT}get-all-transaction?id=${id}`;
    return HttpGet(url, "")
}

export async function getWeeklyTransactions(id,from,to) {
    const url = `${FINANCE_ENDPOINT}get-transactions?account=${id}&from=${from}&to=${to}`;
    return HttpGet(url, "")
}


export async function getMostTransactions(account, reference, classC, description, supervisor, from, to) {
    const url = `${FINANCE_ENDPOINT}heavier-transactions?account=${account}&supervisor=${supervisor}&from=0&to=${to}`;
    return HttpGet(url, "")
}

export async function getTransactions(account, reference, classC, description, supervisor, from, to) {
    const url = `${FINANCE_ENDPOINT}get-transactions?account=${account}&supervisor=${supervisor}&from=0&to=${to}`;
    return HttpGet(url, "")
}