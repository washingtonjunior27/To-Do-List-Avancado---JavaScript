// LOCAL STORAGE
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_todo')) || [];
const setLocalStorage = (todo) => localStorage.setItem('db_todo', JSON.stringify(todo))

// CRUD - LOCAL STORAGE
const createTodoLS = (todo) => {
    const getTodos = getLocalStorage();
    getTodos.push(todo);
    setLocalStorage(getTodos);
}

const updateTodoLS = (index, todo) => {
    const getTodos = getLocalStorage();
    getTodos[index] = todo;
    setLocalStorage(getTodos);
}

const deleteTodoLS = (index) => {
    const getTodos = getLocalStorage();
    getTodos.splice(index, 1);
    setLocalStorage(getTodos);
}

// FUNCTIONS
// SANITIZE
const sanitizeItem = (string) => DOMPurify.sanitize(string);

const openMenuMobile = () => document.querySelector('.navbar').classList.toggle('active');

const closeError = () => document.querySelector('.error').classList.remove('active');

const validateTodo = () => {
    const inputTodo = document.getElementById('inputTodo').value;

    if(!inputTodo){
        document.getElementById('errorMessage').textContent = "Preencha os campos vazios!";
        document.querySelector('.error').classList.add('active');
        document.getElementById('inputTodo').dataset.index = "new"; //if edit error return data-index to new
        document.getElementById('inputTodo').placeholder = "Cadastrar tarefa"; ////if edit error return placeholder to new
        document.getElementById('btnTodo').classList.remove('warning'); //if edit error remove button background color
        document.getElementById('btnTodo').innerHTML = sanitizeItem(`<i class="fa-solid fa-plus"></i>`); //if edit error change fa icon
        return false
    }

    return true;
}

const clearInputTodo = () => {
    document.getElementById('inputTodo').value = "";
}

const changeTodo = () => {
    const valueSelect = document.getElementById('selectTodo').value;
    const getTodos = document.querySelectorAll('.table tbody tr');
    
    switch(valueSelect){
        case 'all':
            getTodos.forEach(todo => todo.style.display = "")
            break;
        case 'done':
            getTodos.forEach(todo => todo.classList.contains('complete') 
            ? todo.style.display = "" 
            : todo.style.display = "none");
            break;
        case 'incomplete':
            getTodos.forEach(todo => !todo.classList.contains('complete') 
            ? todo.style.display = "" 
            : todo.style.display = "none");
            break;
        default:
            break;
    }
}

// CRUD - DOM
const createTodo = () => {
    if(validateTodo()){
        const inputTodo = sanitizeItem(document.getElementById('inputTodo').value);
        const inputIndex = sanitizeItem(document.getElementById('inputTodo').dataset.index);

        const todo = {
            todo: inputTodo,
            done: 0
        }

        if(inputIndex == "new"){ //if register
            createTodoLS(todo);
            clearInputTodo();
            readTodo();
        }else{ //if edit
            updateTodoLS(inputIndex, todo);
            clearInputTodo();
            readTodo();
            document.getElementById('inputTodo').dataset.index = "new"; //return data index to new
            document.getElementById('inputTodo').placeholder = "Cadastrar tarefa"; //return placeholder to register
            document.getElementById('btnTodo').classList.remove('warning'); //remove background orange
            document.getElementById('btnTodo').innerHTML = sanitizeItem(`<i class="fa-solid fa-plus"></i>`); //return icon fa to add
        }
    }
}

const searchTodo = () => {
    const inputSearch = sanitizeItem(document.getElementById('inputSearch').value.toLowerCase());
    const getTodos = document.querySelectorAll('.table tbody tr');

    if(inputSearch == ""){
        getTodos.forEach(todo => {
            todo.style.display = "";
        })
    }else{
        getTodos.forEach(todo => {
            const todoText = todo.textContent.toLowerCase();
            if(todoText.includes(inputSearch)){
                todo.style.display = "";
            }else{
                todo.style.display = "none";
            }
        })
    }
}

const readTodo = () => {
    const getTodos = getLocalStorage();
    
    const table = document.querySelector('.table tbody');

    table.innerHTML = "";

    if(getTodos.length > 0){
        getTodos.forEach((todo, index) => {
            const newTr = document.createElement('tr');

            if(todo.done){
                newTr.classList.add('complete');
            }

            const newTdTodo = document.createElement('td')
            newTdTodo.setAttribute('class', 'todoText');
            newTdTodo.textContent = sanitizeItem(todo.todo);

            const newTdActions = document.createElement('td');
            newTdActions.setAttribute('class', 'actions');

            const newBtnCheck = document.createElement('button');
            newBtnCheck.setAttribute('id', sanitizeItem(`check-${index}`));
            newBtnCheck.setAttribute('class','check');
            
            const newBtnEdit = document.createElement('button');
            newBtnEdit.setAttribute('id', sanitizeItem(`edit-${index}`));
            newBtnEdit.setAttribute('class','warning');
            
            const newBtnDelete = document.createElement('button');
            newBtnDelete.setAttribute('id', sanitizeItem(`delete-${index}`));
            newBtnDelete.setAttribute('class','danger');

            const newIconCheck = document.createElement('i');
            newIconCheck.setAttribute('class', 'fa-solid fa-check');
            
            const newIconEdit = document.createElement('i');
            newIconEdit.setAttribute('class', 'fa-regular fa-pen-to-square');
            
            const newIconDelete = document.createElement('i');
            newIconDelete.setAttribute('class', 'ffas fa-xmark');

            newBtnCheck.appendChild(newIconCheck);
            newBtnEdit.appendChild(newIconEdit);
            newBtnDelete.appendChild(newIconDelete);
            newTdActions.append(newBtnCheck, newBtnEdit, newBtnDelete);

            newTr.append(newTdTodo, newTdActions);
    
            table.appendChild(newTr);
        });
    }else{
        const newTr = document.createElement('tr');

        const newTd = document.createElement('td');
        newTd.setAttribute('colspan', '2');
        newTd.setAttribute('id', 'emptyTasks');
        newTd.textContent = 'Sem tarefas cadastradas!';
        
        newTr.appendChild(newTd);
        table.appendChild(newTr);
    }
}

const editFunc = (index) => {
    const getUsers = getLocalStorage()[index]; //getuser
    document.getElementById('inputTodo').value = sanitizeItem(getUsers.todo); //place input with user
    document.getElementById('inputTodo').dataset.index = index; //change index new to user index for edit
    document.getElementById('inputTodo').placeholder = "Editar tarefa"; //change placeholder input
    document.getElementById('btnTodo').classList.add('warning');//change background color button
    document.getElementById('btnTodo').innerHTML = sanitizeItem(`<i class="fa-regular fa-pen-to-square"></i>`);//change icon button
}

const deleteTodo = (index) => {
    const getUsers = getLocalStorage()[index];
    const response = confirm(`Tem certeza que deseja excluir a tarefa ${getUsers.todo}`)
    if(response){
        deleteTodoLS(index);
        readTodo();
    }
}

// EVENTS
document.getElementById('toggle').addEventListener('click', () => openMenuMobile())
document.getElementById('closeError').addEventListener('click', () => closeError());

document.getElementById('inputSearch').addEventListener('input', () => searchTodo());
document.getElementById('selectTodo').addEventListener('change', () => changeTodo());

document.getElementById('formTodo').addEventListener('submit', (e) => {
    e.preventDefault();
    
    createTodo();
})

document.querySelector('.table tbody').addEventListener('click', (e) => {
    if(e.target.type == "submit"){
        const splitButton = e.target.id.split('-');
        const [action, index] = splitButton;

        if(action == "check"){
            const getUsers = getLocalStorage()[index]
            const parentElTd = e.target.parentElement;
            const parentElTr = parentElTd.parentElement;
            parentElTr.classList.toggle('complete');
            if(parentElTr.classList.contains('complete')){
                const todo = {
                    todo: parentElTr.querySelector('.todoText').textContent,
                    done: 1
                }
                updateTodoLS(index, todo);
            }else{
                const todo = {
                    todo: parentElTr.querySelector('.todoText').textContent,
                    done: 0
                }
                updateTodoLS(index, todo);
            }
        }
        if(action == "edit"){
            editFunc(index);
        }
        if(action == "delete"){
            deleteTodo(index);
        }
    }
})

readTodo();