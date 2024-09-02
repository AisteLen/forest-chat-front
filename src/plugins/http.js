const rootUrl = 'http://localhost:2000'

const http = {
    post: (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify(data)
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
    postAuth: (url, data, token) => {
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: token
            },
            body: JSON.stringify(data)
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
    get: (url) => {
        return fetch(rootUrl + url)
            .then(res => res.json());
    },
    put: (url, data) => {
        const options = {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return fetch(rootUrl + url, options)
            .then(res => res.json());
    },
    delete: (url, data) => {
        const options = {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return new Promise(resolve => {
            fetch(rootUrl + url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    }
}

export default http