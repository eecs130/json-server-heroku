const js = {
    generateGetCommand: (endpoint) => {
        return `fetch('${endpoint}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
    },
    generateCreateUpdateCommand: (endpoint, method, editedData) => {
        let formattedJSON = editedData;
        // format whitespace
        if (formattedJSON !== '{}') {
            formattedJSON = formattedJSON.replace(/    /g, "            ");
            formattedJSON = formattedJSON.replace('}', '        }');
        }
        return `fetch('${endpoint}', {
        method: '${method.toUpperCase()}',
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
    }, 
    generateDeleteCommand: (endpoint) => {
    return `fetch('${endpoint}', { 
        method: 'DELETE' 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
    }
};



getJavaScriptCommand = (method, endpoint, jsonText) => {
    if (method === 'get') {
        return js.generateGetCommand(endpoint);
    } else if (method === 'delete') {
        return js.generateDeleteCommand(endpoint);
    } else {
        return js.generateCreateUpdateCommand(endpoint, method, jsonText);
    }
};

const python = {
    generateGetCommand: (endpoint) => {
        return `import requests
response = requests.get("${endpoint}")
print(response.json())`;
    },
    generateCreateUpdateCommand: (endpoint, method, editedData) => {
        return `import requests
response = requests.${method}("${endpoint}", data=${editedData})
print(response.json())`;
    },
    generateDeleteCommand: (endpoint) => {
        return `import requests
response = requests.delete("${endpoint}")
print(response.json())`;
    }
};

getPythonCommand = (method, endpoint, jsonText) => {
    if (method === 'get') {
        return python.generateGetCommand(endpoint);
    } else if (method === 'delete') {
        return python.generateDeleteCommand(endpoint);
    } else {
        return python.generateCreateUpdateCommand(endpoint, method, jsonText);
    }
};