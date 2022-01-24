import { HttpGet, HttpPost } from "endpoint"

const ADMIN_ENDPOINT = process.env.REACT_APP_ADMIN_URL
const SUPERVISOR_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function getValues() {
    const url = `${ADMIN_ENDPOINT}v1/parameters`
    return HttpGet(url, "")
}

export async function getWallet() {
    const url = `${SUPERVISOR_ENDPOINT}v1/mywallet`
    return HttpGet(url, "")
}

export async function activateSupervisor() {
    const url = `${SUPERVISOR_ENDPOINT}v1/activate`
    return HttpGet(url, null)
}