import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function findTargets() {
    const url = `${ADMIN_ENDPOINT}v1/all-target`
    return HttpGet(url, "")
}

export async function findTarget(id) {
    const url = `${ADMIN_ENDPOINT}v1/targets/${id}`
    return HttpGet(url, "")
}

export async function cancelTarget(id) {
    const url = `${ADMIN_ENDPOINT}v1/target/cancel/${id}`
    return HttpPost(url, "")
}

export async function findAssignments() {
    const url = `${ADMIN_ENDPOINT}v1/get-assignments`
    return HttpGet(url, "")
}

export async function createATarget(data) {
    const url = `${ADMIN_ENDPOINT}v1/create-target`
    return HttpPost(url, data)
}

export async function createAssignment(data) {
    const url = `${ADMIN_ENDPOINT}v1/target-assignment`
    return HttpPost(url, data)
}
