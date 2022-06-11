async function postData(url = '', data = {}) {
    const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    cors: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
    });
    return response.json();
};


async function getData(url = '') {
    const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    cors: 'no-cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    });
    return response.json();
};

async function deleteData(url = '') {
    const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    cors: 'no-cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    });
    return response.status;
};

async function patchData(url = '', data = {}) {
    const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    cors: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
    });
    return response.json();
};

export { postData, getData, deleteData, patchData };