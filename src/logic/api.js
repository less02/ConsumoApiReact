export function getData(url, headers) {
    const data = fetch(url, {
        headers: headers
    }).then((response) => {
        return response.json();
    }).then((data) => {
        return data;
    });
    return data;
}