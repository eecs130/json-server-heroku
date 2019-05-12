const getData = () => {
    fetch('http://localhost:3000/posts')
        .then(response => {
            return response.json();
        })
        .then(displayData)
        .then(attachEventHandlers);
};

const attachEventHandlers = () => {
    for (elem of document.querySelectorAll('.delete')) {
        elem.onclick = deleteFromDatabase;
    }
    for (elem of document.querySelectorAll('.edit')) {
        elem.onclick = showEditForm;
    }
};

const attachFormEventHandlers = (item, container) => {
    container.querySelector('.update').onclick = (ev) => {
        updateData(ev);
    };
    container.querySelector('.cancel').onclick = () => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    }
};

const updateData = (ev) => {
    const id = ev.target.getAttribute('data-id');
    const container = ev.target.parentElement.parentElement;
    fetch('http://localhost:3000/posts/' + id, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'first_name': container.querySelector('#first_name').value,
            'last_name': container.querySelector('#last_name').value
        })
    }).then(response => {
        return response.json();
    }).then(item => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    });
};

const deleteFromDatabase = (ev) => {
    const id = ev.target.id;
    const areYouSure = confirm('Are you sure that you want to delete item #' + id + '?')
    if (!areYouSure) {
        return;
    }
    fetch('http://localhost:3000/posts/' + id, {
            method: 'delete'
        }).then(getData);
};

const showEditForm = (ev) => {
    const id = ev.target.id;
    const cardElement = ev.target.parentElement.parentElement;
    fetch('http://localhost:3000/posts/' + id)
        .then(response => {
            return response.json();
        })
        .then(item => {
            displayForm(item, cardElement);
        })
        .then(() => {
            attachFormEventHandlers(item, cardElement);
        });
    return false;
};

const displayForm = (item, container) => {
    container.innerHTML = `
        <div style="margin-top:7px;">
            <label>id:</label><span>${item.id}</span><br>
            <label>first_name:</label>
            <input type="text" id="first_name" value="${item.first_name}"><br>
            
            <label>last_name:</label>
            <input type="text" id="last_name" value="${item.last_name}"><br>
            
            <label></label>
            <button type="button" data-id="${item.id}" class="update">Update</button>
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
        <label>first_name:</label><span>${item.first_name}</span><br>
        <label>last_name:</label><span>${item.last_name}</span>
    </div>`;
};

const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `
        <div class="card-wrapper">${itemHTML}</div>
    `;
};

const displayData = (data) => {
    const container = document.querySelector("#container");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
};

getData();