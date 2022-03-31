import {API_URL} from "./consts"

const originalRequest = async (query: object) => {
    let accessToken = localStorage.getItem('accessToken') ?? null;
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(query)
    })
    const data = await response.json()
    return {response, data}
}

const refreshToken = async () => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation($refreshToken: String!){
                        users{
                            refresh(refreshToken: $refreshToken) {
                                accessToken
                            }
                        }
                    }`,
            variables: {
                refreshToken: localStorage.getItem('refreshToken')
            }
        })
    })
    const data = await response.json();
    localStorage.setItem('accessToken', data.data.users.refresh.accessToken);
    return data;
}

const customFetcher = async (query: object): Promise<any> => {
    let {response, data} = await originalRequest(query)

    function isArray(input: unknown): input is Array<any> {
        return (input as Array<any>).length !== undefined;
    }

    if (data.errors !== undefined && isArray(data?.errors)) {
        if (data.errors[0].message === "INVALID_TOKEN") {
            data = await refreshToken()
            const newResponse = await originalRequest(query)
            response = newResponse.response
            data = newResponse.data
        }
    }

    return {response, data}
}

export default customFetcher
