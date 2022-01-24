import { HttpPost } from 'endpoint';
import { HttpGet } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT
//TODO Make this call via service 
const TRANSACTION_ENDPOINT = process.env.REACT_APP_TRANSACTION_ENDPOINT



export async function getTarget(id) {
    const url = `${AGENT_ENDPOINT}agent/gettarget/${id}`
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

export async function deleteTarget(id) {
    const url = `${AGENT_ENDPOINT}agent/target/delete/${id}`
    return HttpGet(url, "")
}