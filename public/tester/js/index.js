const rootURL = document.location.protocol + '//' + document.location.host + '/';
const menuElement = document.querySelector("#menu");
const methodElement = document.querySelector("#method");
const codeContainer = document.querySelector("#code-container");
const submitElement = document.querySelector("button");
let alertElement = document.querySelector(".alert");

const jsonViewer = CodeMirror(document.getElementById('data-container'), {
    mode: 'javascript',
    lineWrapping: true
});
jsonViewer.on("keydown", () => {
    //console.log('changing!');
    displayCode();
});
jsonViewer.on("keyup", () => {
    //console.log('changing!');
    displayCode();
});
const javascriptViewer = CodeMirror(document.getElementById('javascript-container'), {
    mode: 'javascript',
    readOnly: true
});
const pythonViewer = CodeMirror(document.getElementById('python-container'), {
    mode: 'python',
    readOnly: true
});

const initialize = () => {
    populateEndpoints();

    // initialize event handlers:
    submitElement.onclick = go;
    menuElement.onchange = handleEndpointChange;
    methodElement.onchange = handleMethodChange;
    for (elem of document.querySelectorAll('input[type="radio"]')) {
        elem.onclick = toggleHack;
    }
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
            <option value="patch">PATCH</option>
            <option value="delete">DELETE</option>`;
    }
};

const buildEndpointsMenu = (data) => {
    menuElement.innerHTML = '';
    const options = [];
    for (endpoint in data) {
        const label = endpoint.charAt(0).toUpperCase() + endpoint.slice(1);
        const baseEndpoint = rootURL + endpoint;
        options.push(`<optgroup label="${label}">`);
        options.push(`<option endpoint-type="list" value="${baseEndpoint}">${baseEndpoint}</option>`);
        for (item of data[endpoint]) {
            options.push(`
                <option endpoint-type="detail" value="${baseEndpoint}/${item.id}">
                    ${baseEndpoint}/${item.id}
                </option>`);
        }
        options.push(`</optgroup>`);
    }
    menuElement.innerHTML = options.join('');
};

const populateEndpoints = () => {
    fetch(rootURL + 'db')
        .then(response => response.json())
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
    // only re-populate if needed:
    const endpointType = getEndpointType();
    const detailToList = methodElement.innerHTML.indexOf('put') != -1 && endpointType === 'list';
    const listToDetail = methodElement.innerHTML.indexOf('post') != -1 && endpointType === 'detail';
    if (detailToList || listToDetail) {
        populateMethods();
    }
    // only fetch if needed:
    fetchIfNeeded();
};

const fetchIfNeeded = handleMethodChange = () => {
    const method = getMethod();
    if (method === 'post') {
        jsonViewer.getDoc().setValue('{}');
        displayCode();
    } else {
        issueGetRequest();
    }
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
        jsonViewer.getDoc().setValue(JSON.stringify(data, null, 4));
    }
};

const showMessage = (message, isError=false) => {
    alertElement.innerHTML = message;
    alertElement.classList.remove('alert-error', 'alert-success');
    if (isError) {
        alertElement.classList.add('alert-error');
    } else {
        alertElement.classList.add('alert-success');
    }
    var newMessageElement = alertElement.cloneNode(true);
    alertElement.parentNode.replaceChild(newMessageElement, alertElement);
    alertElement = newMessageElement;
};

const showConfirmationMessage = () => {
    showMessage(`Your ${getMethod().toUpperCase()} request was successfully executed.`);
};

const updateJSON = () => {
    console.log('formatting...');
    if (getMethod() === 'get') {
        jsonViewer.setOption('readOnly', true);
    } else {
        jsonViewer.setOption('readOnly', false);
    }
};

const toggleHack = () => {
    displayCode();
    // a hack when tabbing:
    jsonViewer.getDoc().setValue(jsonViewer.getDoc().getValue());
};

const displayCode = () => {
    javascriptViewer.getDoc().setValue(getJavaScriptCommand(
        getMethod(), 
        getEndpoint(), 
        jsonViewer.getDoc().getValue()
    ));
    pythonViewer.getDoc().setValue(getPythonCommand(
        getMethod(), 
        getEndpoint(), 
        jsonViewer.getDoc().getValue()
    ));
    updateJSON();

};

const validateJSON = () => {
    try {
        JSON.parse(jsonViewer.getDoc().getValue());
        return true;
    } catch (e) {
        console.error(e);
        return false;
    } 
};

const go = () => {
    if (!validateJSON()) {
        showMessage(`Your JSON data is not correctly formatted. Please review it`, isError=true);
        return;
    }
    const method = getMethod();
    let code = javascriptViewer.getDoc().getValue();
    if (!validateJSON(code))
    code = code.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
    let extras = '';
    if (['delete', 'post'].includes(method)) {
        extras = 'populateEndpoints();';
    }
    // inject some additional callback functions:
    code = code.slice(0, code.lastIndexOf('});'));
    code += `
        displayData(data);
        displayCode(); 
        showConfirmationMessage();
        ${extras}
    });`;
    console.log(code);
    try {
        eval(code);
    } catch(e) {
        console.log(e);
    }
};

initialize();
