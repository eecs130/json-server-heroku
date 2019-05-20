const endpoint = '../../users';
const issueGetRequest = () => {
    // get data from the server:
    console.log('GET request:', endpoint);
    fetch(endpoint)
        .then(response => response.json())
        .then(displayData)
        .then(attachEventHandlers);
};

const issuePutRequest = (id, data, responseHandler) => {
    // update data on the server:
    const url = endpoint + '/' + id;
    console.log('PUT request:', url, data);
    fetch(url, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseHandler);
};

const issueDeleteRequest = (id, responseHandler) => {
    // delete data on the server:
    const url = endpoint + '/' + id;
    console.log('DELETE request:', url);
    fetch(url, { method: 'delete' })
        .then(responseHandler);
};

const issuePostRequest = (data, responseHandler) => {
   // create data on the server:
   console.log('POST request:', endpoint, data);
   fetch(endpoint, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(responseHandler);
};

const handleUpdate = (ev) => {
    const id = ev.target.getAttribute('data-id');
    const container = ev.target.parentElement.parentElement;
    const data = {
        'firstname': container.querySelector('#firstname').value,
        'lastname': container.querySelector('#lastname').value,
        'email': container.querySelector('#email').value,
        'avatar': container.querySelector('#avatar').value
    };
    const callback = (item) => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    };
    issuePutRequest(id, data, callback)
};

const handleCreate = () => {
    const container = document.querySelector('.add-new-panel');
    data = {
        'firstname': container.querySelector('.firstname').value,
        'lastname': container.querySelector('.lastname').value,
        'email': container.querySelector('.email').value,
        'avatar': container.querySelector('.avatar').value
    }
    issuePostRequest(data, issueGetRequest);
    document.querySelector('.add-new-panel').classList.remove('active');
};

const handleDelete = (ev) => {
    const id = ev.target.id;
    const areYouSure = confirm('Are you sure that you want to delete item #' + id + '?')
    if (!areYouSure) {
        return;
    }
    issueDeleteRequest(id, issueGetRequest);
};

const attachEventHandlers = () => {
    for (elem of document.querySelectorAll('.delete')) {
        elem.onclick = handleDelete;
    }
    for (elem of document.querySelectorAll('.edit')) {
        elem.onclick = showEditForm;
    }
    document.querySelector('#add-new').onclick = () => {
        const container = document.querySelector('.add-new-panel');
        container.querySelector('.firstname').value = '';
        container.querySelector('.firstname').value = '';
        container.classList.add('active');
    };
    document.querySelector('.close').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.add-new-panel .cancel').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.update.save').onclick = handleCreate;
    
};

const attachFormEventHandlers = (item, container) => {
    container.querySelector('.update').onclick = handleUpdate;
    container.querySelector('.cancel').onclick = () => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    }
};

const showEditForm = (ev) => {
    const id = ev.target.id;
    const url = endpoint + '/' + id;
    const cardElement = ev.target.parentElement.parentElement;
    fetch(url)
        .then(response => response.json())
        .then(item => {
            displayForm(item, cardElement);
            attachFormEventHandlers(item, cardElement);
        });
    return false;
};

const displayForm = (item, container) => {
    container.innerHTML = `
        <div style="margin-top:7px;">
            <label>id:</label><span>${item.id}</span><br>
            <label>firstname:</label>
            <input type="text" id="firstname" value="${item.firstname}"><br>
            
            <label>lastname:</label>
            <input type="text" id="lastname" value="${item.lastname}"><br>
            
            <label>email:</label>
            <input type="text" id="email" value="${item.email}"><br>
            
            <label>avatar:</label>
            <input type="text" id="avatar" value="${item.avatar}"><br>
            
            <label></label>
            <button type="button" data-id="${item.id}" class="update button-primary">Update</button>
            <button type="button" class="cancel">Cancel</button>
        </div>
    `;
};

const getItemHTML = (item) => {
    return `<div>
        <div class="controls">
            <i class="fas fa-edit edit" id="${item.id}"></i>
            <i class="fas fa-trash delete" id="${item.id}"></i>
        </div>
        <label>id:</label><span>${item.id}</span><br>
        <label>firstname:</label><span>${item.firstname}</span><br>
        <label>lastname:</label><span>${item.lastname}</span><br>
        <label>email:</label><span>${item.email}</span><br>
        <label>avatar:</label><img src="${item.avatar}" />
    </div>`;
};

const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `
        <div class="card-wrapper">${itemHTML}</div>
    `;
};

const displayData = (data) => {
    console.log(data)
    const container = document.querySelector("#container");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
};

issueGetRequest();