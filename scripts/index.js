const initDataTodo = (key) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];

const updateDataTodo = (key, todoData) =>
    localStorage.setItem(key, JSON.stringify(todoData));

const createToDo = (title, form, list) => {
    const todoContainer = document.createElement('div');
    const todoHeader = document.createElement('h1');
    const todoRow = document.createElement('div');
    const wrapperForm = document.createElement('div');
    const wrapperList = document.createElement('div');

    todoContainer.classList.add('container');
    todoRow.classList.add('row');
    todoHeader.classList.add('text-center', 'mb-5');
    wrapperForm.classList.add('col-6');
    wrapperList.classList.add('col-6');
    todoHeader.textContent = title;

    wrapperForm.append(form);
    wrapperList.append(list);
    todoRow.append(wrapperForm, wrapperList);
    todoContainer.append(todoHeader, todoRow);

    return todoContainer;
}


const createListTodo = () => {
    const listTodo = document.createElement('ul');
    listTodo.classList.add('list-group');
    return listTodo;
}

const createItemTodo = (item, listTodo) => {
    const itemTodo = document.createElement('li');
    const btnItem = document.createElement('button');

    itemTodo.classList.add('list-group-item', 'p-0', 'mb-3', 'border-0');
    btnItem.classList.add(item.success ? 'btn-success' : 'btn-light','list-item', 'btn', 'btn-block', 'shadow');
    btnItem.textContent = item.nameTodo;
    btnItem.id = item.id;
    itemTodo.append(btnItem);
    listTodo.append(itemTodo);
    // return itemTodo;
}

const createFormTodo = () => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const textArea = document.createElement('textarea');
    const btnSubmit = document.createElement('button');

    input.placeholder = 'Наименование';
    textArea.placeholder = "Описание";

    btnSubmit.type = 'submit';
    btnSubmit.textContent = "Добавить";

    form.classList.add('form-group');
    input.classList.add('form-control', 'mb-3');
    textArea.classList.add('form-control', 'mb-3');
    btnSubmit.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-block');

    form.append(input, textArea, btnSubmit);
    return { input, textArea, btnSubmit, form }
};

const addTodoItem = (key, id, todoData, listTodo, nameTodo, descptionTodo) => {
    todoData.push({ id, nameTodo, descptionTodo, success: false });
    updateTodo(listTodo, todoData, key);
}


const createModal = () => {
    const modal = document.createElement('div');
    const modalDialog = document.createElement('div');
    const modalContent = document.createElement('div');
    const modalHeader = document.createElement('div');
    const itemTitle = document.createElement('h2');
    const itemDescription = document.createElement('p');
    const modalBody = document.createElement('div');
    const modalFooter = document.createElement('div');
    const btnClose = document.createElement('button');
    const btnReady = document.createElement('button');
    const btnDelete = document.createElement('button');

    modal.classList.add('modal');
    modalDialog.classList.add('modal-dialog');
    modalContent.classList.add('modal-content');
    modalHeader.classList.add('modal-header');
    itemTitle.classList.add('modal-title');
    modalBody.classList.add('modal-body');
    modalFooter.classList.add('modal-footer');
    btnClose.classList.add('close', 'btn-modal');
    btnReady.classList.add('btn', 'btn-success', 'btn-modal');
    btnDelete.classList.add('btn', 'btn-danger','btn-delete', 'btn-modal');

    btnClose.innerHTML = '&times;';
    btnReady.textContent = 'Выполнено';
    btnDelete.textContent = 'Удалить';

    modalDialog.append(modalContent);
    modalContent.append(modalHeader, modalBody, modalFooter);
    modalHeader.append(itemTitle, btnClose);
    modalBody.append(itemDescription);
    modalFooter.append(btnReady, btnDelete);

    modal.append(modalDialog);



    const closeModal = (event) => {
        const target = event.target;

        if (target.classList.contains('btn-modal') || target === modal) {
            modal.classList.remove('d-block');
        }
    }

    const showModal = (titleTodo,descriptionTodo, id) => {
        modal.dataset.idItem = id;
        modal.classList.add('d-block');
        itemTitle.textContent = titleTodo;
        itemDescription.textContent = descriptionTodo;
    }

    modal.addEventListener('click', closeModal);
    return { modal, btnReady, btnDelete, showModal }
}

const updateTodo = (listTodo, todoData, key) => {
    listTodo.textContent = '';
    todoData.forEach(item => createItemTodo(item, listTodo));
    updateDataTodo(key, todoData);
}
const initToDo = (selector, key = 'todo') => {
    const todoData = initDataTodo(key);

    const wrapper = document.querySelector(selector);
    const formTodo = createFormTodo();
    const listTodo = createListTodo();
    const modal = createModal();

    document.body.append(modal.modal)

    const todoApp = createToDo(key, formTodo.form, listTodo);

    wrapper.append(todoApp);

    formTodo.form.addEventListener('submit', event => {
        event.preventDefault();

        formTodo.input.classList.remove('is-invalid');
        formTodo.textArea.classList.remove('is-invalid');

        if (formTodo.input.value && formTodo.textArea.value )  {
            const id = `todo${(+new Date()).toString(16)}`;
            addTodoItem(key, id, todoData, listTodo, formTodo.input.value, formTodo.textArea.value);
            formTodo.form.reset();
        } else {
            if (!formTodo.input.value) {
                formTodo.input.classList.add('is-invalid');
            }
            if (!formTodo.textArea.value) {
                formTodo.textArea.classList.add('is-invalid');
            }
        }
    });

    listTodo.addEventListener('click', event => {
        const target = event.target;

        if (target.classList.contains('list-item')) {
            const item = todoData.find(el => el.id === target.id)
            modal.showModal(item.nameTodo, item.descptionTodo, item.id);
        }
    })

    modal.btnReady.addEventListener('click', event => {
        const itemTodo = todoData.find(el =>
            el.id === modal.modal.dataset.idItem);
        itemTodo.success = !itemTodo.success;
        updateTodo(listTodo, todoData, key)
    })

    modal.btnDelete.addEventListener('click', () => {
        const index = todoData.findIndex(el =>
            el.id === modal.modal.dataset.idItem);
        todoData.splice(index, 1);
        updateTodo(listTodo, todoData, key);
    })

    updateTodo(listTodo, todoData, key);
}

initToDo('.app', 'Список дел')