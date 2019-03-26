fetch('/db')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const urls = [];
        for (endpoint in data) {
            const count = data[endpoint].length;
            urls.push(`<a href="/${endpoint}">/${endpoint}</a><sup>${count}x</sup>`);
        }
        urls.push(`<a href="/db">/db</a><sup>state</sup>`);
        document.getElementById('resources').innerHTML = urls.join('<br>');
    });
