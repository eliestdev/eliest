import { HttpGet } from "endpoint"


const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT

export async function getBatches() {
    const url = `${AGENT_ENDPOINT}agent/voucher-batches`
    return HttpGet(url, "")
}