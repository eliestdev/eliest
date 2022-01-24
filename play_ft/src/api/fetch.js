const env = process.env;

export const SignInWithUSSD = (number, pin) => {
    return fetch(
        `${env.REACT_APP_PLAY_URL}login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                msisdn: number,
                pin
            }),
        }
    );
}

export const PlayUSSD = (number, guess, game) => {
    return fetch(
        `${env.REACT_APP_USSD_URL}v1/play`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                msisdn: number,
                game_id: game,
                guess
            }),
        }
    );
}

export const PlayScratch = (number, guess, game) => {
    return fetch(
        `${env.REACT_APP_USSD_URL}v1/scratch/play?id=${game}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                msisdn: number,
                game_id: game,
                guess:"scratch"
            }),
        }
    );
}

export const GetScratchGames = (token) => {
    return fetch(
        `${env.REACT_APP_AGENT_URL}agent/scratch/get`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }      
        }
    );
}

export const GetProfile = (token) => {
    return fetch(
        `${env.REACT_APP_PLAY_URL}profile`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }      
        }
    );
}

export const LoadVoucher = (msisdn, code) => {
    return fetch(
        `${env.REACT_APP_USSD_URL}v1/fund/voucher`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            } ,
            body: JSON.stringify({
                msisdn,
                code,
            }),     
        }
    );
}


