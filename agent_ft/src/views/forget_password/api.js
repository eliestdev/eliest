import API from 'endpoint';


export async function login(user) {
    return API.post(`/agent/login`, user)
}
