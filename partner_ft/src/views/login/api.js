import { HttpPost } from 'endpoint';

const ADMIN_ENDPOINT = process.env.REACT_APP_ADMIN_ENDPOINT

export async function login(user) {
    const url = `${ADMIN_ENDPOINT}v1/partnerlogin`
    return HttpPost(url, {...user}, "")
}
