import { HttpPut } from 'endpoint';
import { HttpGet } from 'endpoint';
import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL

export async function getPartners() {
    const url = `${ADMIN_ENDPOINT}v1/partnerlist`
    return HttpGet(url, "")
}

export async function addPartner(data) {
    const url = `${ADMIN_ENDPOINT}v1/addpartner`
    return HttpPost(url, data)
}


export async function updateAPartner(data) {
    const url = `${ADMIN_ENDPOINT}v1/updatepartner/${data.id}`
    return HttpPut(url, data)
}

export async function deleteAPartner(data) {
    const url = `${ADMIN_ENDPOINT}v1/updatepartner/${data.id}`
    return HttpPut(url, data)
}
