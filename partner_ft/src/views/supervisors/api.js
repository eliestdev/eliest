import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function findSupervisors() {
    const url = `${ADMIN_ENDPOINT}v1/all-supervisors`
    return HttpGet(url, "")
}

export async function findSupervisor(id) {
    const url = `${ADMIN_ENDPOINT}v1/supervisor/${id}`
    return HttpGet(url, "")
}

export async function suspendSupervisor(id) {
    const url = `${ADMIN_ENDPOINT}v1/supervisor/suspend/${id}`
    return HttpPost(url, "")
}

export async function unsuspendSupervisor(id) {
    const url = `${ADMIN_ENDPOINT}v1/supervisor/unsuspend/${id}`
    return HttpPost(url, "")
}

export async function getSupervisorCount() {
    const url = `${ADMIN_ENDPOINT}v1/supervisor/count`
    return HttpGet(url, "")
}

export async function setSupervisorCount(count) {
    const url = `${ADMIN_ENDPOINT}v1/supervisor/count/change`
    return HttpPost(url, { id: "1", count: Number(count) })
}