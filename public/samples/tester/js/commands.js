const _generateGetCommand = (endpoint) => {
    return `fetch('${endpoint}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
};
const _generateCreateUpdateCommand = (endpoint, method, editedData) => {
    let formattedJSON = editedData;
    // format whitespace
    if (formattedJSON !== '{}') {
        formattedJSON = formattedJSON.replace(/    /g, "            ");
        formattedJSON = formattedJSON.replace('}', '        }');
    }
    return `fetch('${endpoint}', {
        method: '${method}',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(${formattedJSON})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`;
};

const _generateDeleteCommand = (endpoint) => {
    return `fetch('${endpoint}', { 
        method: 'delete' 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
};

getFetchCommand = (method, endpoint, jsonText) => {
    if (method === 'get') {
        return _generateGetCommand(endpoint);
    } else if (method === 'delete') {
        return _generateDeleteCommand(endpoint);
    } else {
        return _generateCreateUpdateCommand(endpoint, method, jsonText);
    }
};