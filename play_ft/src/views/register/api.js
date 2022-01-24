import API from 'endpoint';


export function register(user) {
    const result = await fetch(`${process.env.REACT_APP_USSD_URL}v1/games/list`)

    return API.post(`/agent/signup`, user)
}
