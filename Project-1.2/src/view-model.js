export class ViewModel {
    constructor() {
        this.btnAdd = document.querySelector("#btnAdd");
        this.btnDelete = document.querySelector("#btnDelete");
        this.edtFilter = document.querySelector("#edtFilter");
        this.todoList = document.querySelector("todo-list");

        this.btnAddClickHandler = this.btnAddClick.bind(this);
        this.btnDeleteClickHandler = this.btnDeleteClick.bind(this);
        this.edtFilterChangeHandler = this.edtFilterChange.bind(this);

        this.btnAdd.addEventListener("click", this.btnAddClickHandler);
        this.btnDelete.addEventListener("click", this.btnDeleteClickHandler);
        this.edtFilter.addEventListener("keyup", this.edtFilterChangeHandler);
    }

    dispose() {
        this.btnAdd.removeEventListener(this.btnAddClickHandler);
        this.btnDelete.removeEventListener(this.btnDeleteClickHandler);
        this.edtFilter.removeEventListener("change", this.edtFilterChangeHandler);

        delete this.btnAdd;
        delete this.btnDelete;
        delete this.edtFilter;
        delete this.todoList;
    }

    btnAddClick() {
        const value = prompt("What must you do?", "Todo Item");

        if (value != undefined) {
            this.todoList.add(value);
        }
    }

    btnDeleteClick() {
        this.todoList.deleteSelectedItems();
    }

    edtFilterChange(event) {
        this.todoList.filter(event.target.value);
    }
}