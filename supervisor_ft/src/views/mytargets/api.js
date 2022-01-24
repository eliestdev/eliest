

import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const AGENT_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function getTargets() {
    const url = `${AGENT_ENDPOINT}v1/mytargets`
    return HttpGet(url, "")
}

export async function claimReward(tid) {
    const url = `${AGENT_ENDPOINT}v1/claimreward?tid=${tid}`
    return HttpGet(url, "")
}