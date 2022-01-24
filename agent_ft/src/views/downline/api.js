import { HttpGet, HttpPost } from "endpoint"


const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT

export async function getDownline() {
    const url = `${AGENT_ENDPOINT}agent/downline`
    return HttpGet(url, "")
}

export async function findDownlineAgent(id, ref, phone) {
    const url = `${AGENT_ENDPOINT}agent/find-agent?id=${id}&ref_code=${ref}&phone=${phone}`
    return HttpGet(url, "")
}

export async function getWallets() {
    const url = `${AGENT_ENDPOINT}agent/wallets`
    return HttpGet(url, "")
}

export async function getDownlineTransactions(id) {
    const url = `${AGENT_ENDPOINT}agent/downline/${id}?id=${id}`
    return HttpGet(url, "")
}

export async function getDailyTransactions(id) {
    const today = new Date().setDate(new Date().getDay())
    const tomorrow = new Date().setDate(new Date().getDay() + 1);
    const url = `${AGENT_ENDPOINT}agent/transactions/${id}?wallet_id=${id}`
    return HttpGet(url, "")
}

export async function moveToFundedWallet(id, amount) {
    const url = `${AGENT_ENDPOINT}agent/move-funded`
    return HttpPost(url, { id, amount })
}