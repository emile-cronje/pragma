export class ToDoListView {
    constructor(viewModel) {
        this.btnAdd = document.querySelector("#btnAdd");
        this.btnDelete = document.querySelector("#btnDelete");
        this.btnCompleted = document.querySelector("#btnCompleted");
        this.edtFilter = document.querySelector("#edtFilter");
        this.todoList = document.querySelector("#todo");
        this.completedList = document.querySelector("#completed");

        this.btnAddClickHandler = this.btnAddClick.bind(this);
        this.btnDeleteClickHandler = this.btnDeleteClick.bind(this);
        this.btnCompletedClickHandler = this.btnCompletedClick.bind(this);
        this.edtFilterChangeHandler = this.edtFilterChange.bind(this);

        this.btnAdd.addEventListener("click", this.btnAddClickHandler);
        this.btnDelete.addEventListener("click", this.btnDeleteClickHandler);
        this.btnCompleted.addEventListener("click", this.btnCompletedClickHandler);
        this.edtFilter.addEventListener("keyup", this.edtFilterChangeHandler);

        this.viewModel = viewModel;

        this.todoListClickHandler = this._todoListClick.bind(this);
        this.todoList.addEventListener("click", this.todoListClickHandler);

        this.completedListClickHandler = this._completedListClick.bind(this);
        this.completedList.addEventListener("click", this.completedListClickHandler);

        this._renderList();
    }

    dispose() {
        this.btnAdd.removeEventListener(this.btnAddClickHandler);
        this.btnDelete.removeEventListener(this.btnDeleteClickHandler);
        this.btnCompleted.removeEventListener(this.btnCompletedClickHandler);
        this.edtFilter.removeEventListener("change", this.edtFilterChangeHandler);
        this.todoList.removeEventListener("click", this.todoListClickHandler);
        this.completedList.removeEventListener("click", this.completedListClickHandler);

        this.btnAddClickHandler = null;
        this.btnDeleteClickHandler = null;
        this.btnCompletedClickHandler = null;
        this.edtFilterChangeHandler = null;
        this.todoListClickHandler = null;
        this.completedListClickHandler = null;

        this.btnAdd = null;
        this.btnDelete = null;
        this.btnCompleted = null;
        this.edtFilter = null;
        this.todoList = null;
        this.completedList = null;
    }

    async _filter(text) {
        const toDoItems = await this.viewModel.fetchItemsAsync();
        const toDoItemsToShow = toDoItems.todo.filter(item => item.title.indexOf(text) > -1).map(item => item.id);
        const completedItemsToShow = toDoItems.completed.filter(item => item.title.indexOf(text) > -1).map(item => item.id);

        for (let todoItem of this.todoList.children) {
            const visible = toDoItemsToShow.indexOf(Number(todoItem.dataset.id)) != -1;
            todoItem.setAttribute("aria-hidden", !visible);
        }

        for (let todoItem of this.completedList.children) {
            const visible = completedItemsToShow.indexOf(Number(todoItem.dataset.id)) != -1;
            todoItem.setAttribute("aria-hidden", !visible);
        }
    }

    async _addAsync(item) {
        let newItem = await this.viewModel.addItemAsync(item);
        this._addChild(this._renderItem(newItem));
    }

    _renderItem(item, completed) {
        let list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

        const li = document.createElement("li");
        li.setAttribute("data-id", item.id);

        if (completed === true)
            li.setAttribute("data-completed", "true");
        else
            li.setAttribute("data-completed", "false");

        li.setAttribute("aria-hidden", false);

        const divContainer = document.createElement("div");
        divContainer.setAttribute("class", "flex-container");
        li.appendChild(divContainer);

        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "title");
        divTitle.setAttribute("style", "flex-grow: 1");

        const spanTitle = document.createElement("span");
        spanTitle.setAttribute("class", "titlespan");
        spanTitle.innerText = item.title;
        divTitle.appendChild(spanTitle);
        divContainer.appendChild(divTitle);

        const divCheckbox = document.createElement("div");
        divCheckbox.setAttribute("class", "checkbox");
        divCheckbox.setAttribute("style", "flex-grow: .1");
        divContainer.appendChild(divCheckbox);

        let inputCheckBox = document.createElement("input");
        inputCheckBox.type = "checkbox";
        inputCheckBox.setAttribute("class", "switch");
        divCheckbox.appendChild(inputCheckBox);

        list.insertBefore(li, list.childNodes[0]);

        return li;
    }

    async _renderList() {
        let items = await this.viewModel.fetchItemsAsync();
        let sortedToDoItems = items.todo.sort((a, b) => Number(b.id) - Number(a.id));
        let sortedCompletedItems = items.completed.sort((a, b) => Number(b.id) - Number(a.id));

        for (let item of sortedToDoItems) {
            this._renderItem(item);
        }

        for (let item of sortedCompletedItems) {
            this._renderItem(item, true);
        }
    }

    _addChild(child) {
        this.todoList.appendChild(child);
    }

    _todoListClick(event) {
        if (event.target.tagName == "LI") {
            const isSelected = event.target.getAttribute("aria-selected") == "true";
            event.target.setAttribute("aria-selected", !isSelected);
        }
    }

    _completedListClick(event) {
        if (event.target.tagName == "LI") {
            const isSelected = event.target.getAttribute("aria-selected") == "true";
            event.target.setAttribute("aria-selected", !isSelected);
        }
    }

    async btnAddClick() {
        const value = prompt("What must you do?", "Todo Item");

        if (value != undefined) {
            await this._addAsync(value);
        }
    }

    async btnDeleteClick() {
        const selectedToDoItems = Array.from(this.todoList.querySelectorAll('li[aria-selected="true"]'));
        const selectedCompletedItems = Array.from(this.completedList.querySelectorAll('li[aria-selected="true"]'));
        await this.viewModel.deleteItemsAsync(selectedToDoItems);
        await this.viewModel.deleteItemsAsync(selectedCompletedItems, true);

        for (let item of selectedToDoItems) {
            this.todoList.removeChild(item);
        }

        for (let item of selectedCompletedItems) {
            this.completedList.removeChild(item);
        }
    }

    async btnCompletedClick() {
        const selectedToDoItems = Array.from(this.todoList.querySelectorAll('li[aria-selected="true"]'));
        const selectedCompletedItems = Array.from(this.completedList.querySelectorAll('li[aria-selected="true"]'));

        await this.viewModel.completeItems(selectedToDoItems);
        await this.viewModel.completeItems(selectedCompletedItems, true);

        for (let item of selectedToDoItems) {
            item.setAttribute("data-completed", "true");
            this.todoList.removeChild(item);
            this.completedList.appendChild(item);
        }

        for (let item of selectedCompletedItems) {
            item.setAttribute("data-completed", "false");
            this.completedList.removeChild(item);
            this.todoList.appendChild(item);
        }
    }

    edtFilterChange(event) {
        this._filter(event.target.value);
    }
}