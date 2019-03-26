fetch('http://localhost:3000/db')
    .then(response => {
        return response.json();
    })
    .then(data => {
        //const url = 'https://eecs130-restapi.herokuapp.com/'
        const url = 'http://localhost:3000/';
        const urls = [];
        for (key in data) {
            const count = data[key].length;
            const endpoint = url + key;
            urls.push(`<a href="${endpoint}">/${key}</a><sup>${count}x</sup>`);
        }
        urls.push(`<a href="${url}db">/db</a><sup>state</sup>`);
        document.getElementById('resources').innerHTML = urls.join('<br>');
    });
