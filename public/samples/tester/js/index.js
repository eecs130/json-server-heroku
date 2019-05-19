let appData = null;
const rootURL = document.location.protocol + '//' + document.location.host + '/';
const menuElement = document.querySelector("#menu");
const methodElement = document.querySelector("#method");
const dataContainer = document.querySelector("#data-container");
const codeContainer = document.querySelector("#code-container code");
const codeHidden = document.querySelector("input.code");
const submitElement = document.querySelector("button");
let successElement = document.querySelector(".alert");

const initialize = () => {
    populateEndpoints();

    // initialize event handlers:
    submitElement.onclick = go;
    menuElement.onchange = handleEndpointChange;
    methodElement.onchange = handleMethodChange;
    dataContainer.onkeydown = displayCode;
    dataContainer.onkeyup = displayCode;
};

const populateMethods = () => {
    if (getEndpointType() === 'list') {
        methodElement.innerHTML = `
            <option value="get">GET</option>
            <option value="post">POST</option>`;
    } else {
        methodElement.innerHTML = `
            <option value="get">GET</option>
            <option value="put">PUT</option>
            <option value="delete">DELETE</option>`;
    }
};
const setAppData = (data) => {
    appData = data;
};

const buildEndpointsMenu = () => {
    menuElement.innerHTML = '';
    const options = [];
    for (endpoint in appData) {
        const label = endpoint.charAt(0).toUpperCase() + endpoint.slice(1)
        options.push(`<optgroup label="${label}">`);
        options.push(`<option endpoint-type="list" value="${rootURL}${endpoint}">${rootURL}${endpoint}</option>`);
        for (item of appData[endpoint]) {
            options.push(`
                <option endpoint-type="detail" value="${rootURL}${endpoint}/${item.id}">
                    ${rootURL}${endpoint}/${item.id}
                </option>`);
        }
        options.push(`</optgroup>`);
    }
    menuElement.innerHTML = options.join('');
};

const populateEndpoints = () => {
    fetch(rootURL + 'db')
        .then(response => response.json())
        .then(setAppData)
        .then(buildEndpointsMenu)
        .then(populateMethods)
        .then(issueGetRequest);
};

const getEndpoint = () => {
    return menuElement.options[menuElement.selectedIndex].value;
};

const getEndpointType = () => {
    return menuElement.options[menuElement.selectedIndex].getAttribute('endpoint-type');
};

const getMethod = () => {
    return methodElement.options[methodElement.selectedIndex].value;
};

const handleEndpointChange = () => {
    // todo: needs to keep state of selected
    const endpointType = getEndpointType();
    const method = getMethod();
    populateMethods();
    console.log(endpointType);
    if (method === 'post') {
        dataContainer.value = '{}';
    } else {
        showMessage('Fetching data...');
        issueGetRequest();
    }
};

const handleMethodChange = () => {
    const method = getMethod();
    if (method === 'post') {
        dataContainer.value = '{}';
    } else {
        issueGetRequest();
    }
    displayCode();
};

const issueGetRequest = () => {
    // get data from the server:
    fetch(getEndpoint())
        .then(response => response.json())
        .then(displayData)
        .then(displayCode)
};

const displayData = (data) => {
    console.log(data)
    if (data) {
        dataContainer.value = JSON.stringify(data, null, 4);
    }
};

const generateGetCommand = () => {
    return `fetch('${getEndpoint()}')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
};

const generateCreateUpdateCommand = (method) => {
    let formatJSON = dataContainer.value;
    // format whitespace
    if (formatJSON !== '{}') {
        formatJSON = dataContainer.value.replace(/    /g, "            ");
        formatJSON = formatJSON.replace('}', '        }');
    }
    return `fetch('${getEndpoint()}', {
        method: '${method}',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(${formatJSON})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`;
};

const generateDeleteCommand = () => {
    return `fetch('${getEndpoint()}', { 
        method: 'delete' 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });`
};

const showMessage = (message) => {
    successElement.innerHTML = message;
    successElement.classList.add('alert-success');
    var newone = successElement.cloneNode(true);
    successElement.parentNode.replaceChild(newone, successElement);
    successElement = newone;
};

const showConfirmationMessage = () => {
    const method = getMethod();
    showMessage(`Your ${method} request was successfully executed.`);
};

const displayCode = () => {
    const method = getMethod();
    console.log(method)
    if (method === 'get') {
        codeContainer.innerHTML = codeHidden.value = generateGetCommand();
    } else if (method === 'post') {
        codeContainer.innerHTML = codeHidden.value = generateCreateUpdateCommand('post');
    } else if (method === 'put') {
        codeContainer.innerHTML = codeHidden.value = generateCreateUpdateCommand('put');
    } else if (method === 'delete') {
        codeContainer.innerHTML = codeHidden.value = generateDeleteCommand();
    }
    hljs.highlightBlock(codeContainer);
};

const go = () => {
    const method = getMethod();
    let code = codeHidden.value;
    code = code.replace(/&gt;/g, '>');
    code = code.replace(/&lt;/g, '<');
    code = code.slice(0, code.lastIndexOf('});'));
    code += `
        displayData(data);
        displayCode(); 
    `;
    if (['delete', 'post'].includes(method)) {
        code += `
        populateEndpoints();
        `;
    } code += `
    showConfirmationMessage();
    `;
    code += '});'
    console.log(code);
    eval(code);
}

initialize();
