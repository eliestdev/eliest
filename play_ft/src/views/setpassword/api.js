import API from 'endpoint';


export function register(user) {
    return API.post(`/posts`, user)
}
