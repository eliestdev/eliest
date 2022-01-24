import { HttpPost } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT
//TODO Make this call via service 
const TRANSACTION_ENDPOINT = process.env.REACT_APP_TRANSACTION_ENDPOINT

export async function verifyNuban(data) {
    const url = `${AGENT_ENDPOINT}agent/withdraw`
    return HttpPost(url, data)
}

export async function withdrawNuban(data) {
    const url = `${AGENT_ENDPOINT}agent/pay`
    return HttpPost(url, data)
}

export async function sendVtu(vtu) {
    const url = `${AGENT_ENDPOINT}agent/vtu`
    return HttpPost(url, vtu)
}

export async function generateVouchers(vtu) {
    const url = `${AGENT_ENDPOINT}agent/buyvoucher`
    return HttpPost(url, vtu)
}

export async function getTarget(id) {
    const url = `${AGENT_ENDPOINT}agent/target/${id}`
    return HttpGet(url)
}
export async function getMyTarget() {
    const url = `${AGENT_ENDPOINT}agent/mytargets`
    return HttpGet(url)
}

export async function createTarget(data) {
    const url = `${AGENT_ENDPOINT}agent/newtarget`
    return HttpPost(url, data)
}

export async function getGlobalTarget() {
    const url = `${AGENT_ENDPOINT}agent/globalTarget`
    return HttpGet(url)
}

export async function changeProfile(id, phone, address, image) {
    const url = `${AGENT_ENDPOINT}agent/profile/${id}`
    return HttpPost(url, { phone, address, image })
}

export async function Withdraw(amount, wallet, recipient, target) {
    const url = `${AGENT_ENDPOINT}agent/withdrawtarget`
    return HttpPost(url, { amount, wallet, recipient, target })
}