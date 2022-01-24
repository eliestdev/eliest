import API from 'endpoint';


export async function login(user) {
    return API.post(`${process.env.REACT_APP_USSD_URL}/login`, user)
}
