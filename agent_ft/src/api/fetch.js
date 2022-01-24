const env = process.env;

export const AgentSignIn = (number, pin) => {
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