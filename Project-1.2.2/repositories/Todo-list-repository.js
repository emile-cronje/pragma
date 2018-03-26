export class ToDoListRepository {
    constructor() {
        this._items = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
            todo: [],
            completed: []
        };

        this._lastId = 0;
    }

    fetchItemsAsync() {
        return new Promise(resolve => {
            this._items = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
                todo: [],
                completed: []
            };

            resolve(this._items);
        });
    }

    saveItemAsync(item) {
        return new Promise(resolve => {
            if (!item.id) {
                item.id = this._lastId;
            }

            this._items.todo.push(item);

            localStorage.setItem('todoList', JSON.stringify(this._items));
            this._lastId += 1;

            resolve(item);
        });
    }

    saveItemsAsync(items) {
        return new Promise(resolve => {
            localStorage.setItem('todoList', JSON.stringify(items));
            resolve();
        });
    }

    deleteItemsAsync(items, completed) {
        return new Promise(resolve => {
            let list = (completed) ? this._items.completed:this._items.todo;

            for (let item of items) {
                const index = list.indexOf(list.find(i => i.id == Number(item.dataset.id)));
                list.splice(index, 1);
            }

            localStorage.setItem('todoList', JSON.stringify(this._items));
            resolve(this._items);
        });
    }

}
