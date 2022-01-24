import { HttpGet, HttpPost } from "../../endpoint"

const SUPERVISOR_ENDPOINT = process.env.REACT_APP_SUPERVISOR_URL

export async function submitNonAssign(refcode) {
    const url = `${SUPERVISOR_ENDPOINT}v1/assign/non-pay`
    return HttpPost(url, {refcode})
}

export async function autoAssign() {
    const url = `${SUPERVISOR_ENDPOINT}v1/assign/automatically`
    return HttpGet(url, "")
}