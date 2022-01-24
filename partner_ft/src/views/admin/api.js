import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function getAdmins() {
    const url = `${ADMIN_ENDPOINT}v1/adminlist`
    return HttpGet(url, "")
}

export async function addAdmin(data) {
    const url = `${ADMIN_ENDPOINT}v1/add-admin`
    return HttpPost(url, data)
}


export async function updateAAdmin(data) {
    const url = `${ADMIN_ENDPOINT}v1/updateadmin/${data.id}`
    return HttpPut(url, data)
}

export async function deleteAAdmin(data) {
    const url = `${ADMIN_ENDPOINT}v1/updateadmin/${data.id}`
    return HttpPut(url, data)
}
