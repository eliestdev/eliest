import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL
const AGENT_ENDPOINT = process.env.REACT_APP_AGENT_URL

export async function findAgents() {
    const url = `${ADMIN_ENDPOINT}v1/all-agents`
    return HttpGet(url, "")
}

export async function findAgent(id) {
    const url = `${ADMIN_ENDPOINT}v1/agents/${id}`
    return HttpGet(url, "")
}

export async function suspendAgent(id) {
    const url = `${ADMIN_ENDPOINT}v1/agent/suspend/${id}`
    return HttpPost(url, "")
}

export async function unsuspendAgent(id) {
    const url = `${ADMIN_ENDPOINT}v1/agent/unsuspend/${id}`
    return HttpPost(url, "")
}

export async function agentFunding(id, from, to) {
    const url = `${ADMIN_ENDPOINT}v1/agent/fundings?id=${id}&from=${from}&to=${to}`
    return HttpGet(url, "")
}
export async function findTransactions(account) {
    const url = `${ADMIN_ENDPOINT}v1/wallet?account=${account}`
    return HttpGet(url, "")
}

export async function getMyTarget(id) {
    const url = `${ADMIN_ENDPOINT}v1/agent/targets/${id}`
    return HttpGet(url)
}

export async function getGlobalTarget() {
    const url = `${ADMIN_ENDPOINT}v1/agent/target`
    return HttpGet(url)
}

export async function addGlobalTarget(minimum, reward) {
    const url = `${ADMIN_ENDPOINT}v1/agent/target/change`
    return HttpPost(url, { minimum, reward })
}