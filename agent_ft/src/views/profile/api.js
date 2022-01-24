import API from 'endpoint';


export async function ActivationFeePaid(ref) {
    return API.put(`/agent/update`, {ref:ref})
}
