import API from 'endpoint';


export async function login(entry) {
    return API.post(`${process.env.REACT_APP_USSD_URL}/v1/play`, entry)
}
