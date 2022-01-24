import { HttpGet, HttpPost } from '../../endpoint'

const route = process.env.REACT_APP_SUPERVISOR_URL

export const getAgentInfo = (id) => {
    const url = `${route}v1/myagents/${id}?id=${id}`
    return HttpGet(url)
}

export const getAgentDownline = (id) => {
    const url = `${route}v1/agentdownline/${id}?id=${id}`
    return HttpGet(url)
}

export const updateProfile = (phone, address) => {
    const url = `${route}v1/set-profile`;
    return HttpPost(url, { phone, address })
}

export const getWeekTransactions = (start, end, id) => {
    const url = `${route}v1/transactionfilter?from=${start}&to=${end}&id=${id}`;
    return HttpGet(url)
}

export const deactivate = (phone) => {
    const url = `${route}v1/deactivate`;
    return HttpPost(url, { phone })
}