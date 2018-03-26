import {ToDoItem} from '../models/todo_item.js';

export class ViewModel {
    constructor(repository) {
        this._repository = repository;
    }

    dispose() {
        delete this._repository;
    }

    async fetchItemsAsync() {
        return await this._repository.fetchItemsAsync();
    }

    async addItemAsync(title) {
        let newItem = new ToDoItem(title);
        return await this._repository.saveItemAsync(newItem);
    }

    async deleteItemsAsync(items, completed) {
        await this._repository.deleteItemsAsync(items, completed);
    }

    async completeItems(viewItems, completed) {
        let items = await this.fetchItemsAsync();

        for (let viewItem of viewItems) {
            if (completed) {
                const index = items.completed.indexOf(items.completed.find(i => i.id == Number(viewItem.dataset.id)));
                let item = items.completed.find(i => i.id == Number(viewItem.dataset.id));
                items.completed.splice(index, 1);
                items.todo.push(item);
            } else {
                const index = items.todo.indexOf(items.todo.find(i => i.id == Number(viewItem.dataset.id)));
                let item = items.todo.find(i => i.id == Number(viewItem.dataset.id));
                items.todo.splice(index, 1);
                items.completed.push(item);
            }

            viewItem.setAttribute("aria-selected", false);
        }

        console.log('todo count: ' + items.todo.length);
        console.log('completed count: ' + items.completed.length);
        console.log('items: ' + JSON.stringify(items));
        this._repository.saveItemsAsync(items);
    }
}