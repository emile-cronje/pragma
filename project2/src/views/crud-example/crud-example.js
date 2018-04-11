import {inject} from 'aurelia-framework';
import {template} from './schema';
import {items} from './items.js';
import {isMobile, ViewModel, Validator} from 'pragma-views';

@inject(Element)
export class CrudExample extends ViewModel {
    constructor(element) {
        super();
        this.element = element;
        this.schema = template;
    }

    attached() {
        super.attached();
        this.eventAggregator.publish("show-assistant", false);
    }

    formUpdated() {
        super.formUpdated();
        this.selectedId = 1;
    }

    fetchItems() {
        return new Promise(_ => {
            this.items = items;
        })
    }

    selectedIdChanged(id) {
        return new Promise(_ => {
            const item = this.items.find(item => item.id == id);
            this.model.setInitialValues(item);

            if (isMobile()) {
                this.isMasterVisible = false;
            }
        })
    }

    getLookupRecords(remote) {
        return new Promise(_ => {
            let result;

            switch(remote) {
                case "site-resource":
                    result = [
                        {
                            "id": 1,
                            "code": "Site Code 1",
                            "description": "Site Description 1"
                        },
                        {
                            "id": 2,
                            "code": "Site Code 2",
                            "description": "Site Description 2"
                        }];
                    break;
            }

            this.eventAggregator.publish("do-lookup:return-records", result);
        });
    }

    add() {
        const defaults = this.factory.createDefaultFromDefinition(this.model["__definition"]);
        defaults.id = this.items[this.items.length - 1].id + 1;

        this.model.setInitialValues(defaults);
    }

    save() {
        const changes = this.model.getDirtyModel();
        if (Object.keys(changes).length == 0) {
            return;
        }

        Validator.validateDataset(this.model)
            .then(_ => this.performUpdate())
            .catch(errors => {
                this.eventAggregator.publish("add-errors", errors);
            })
    }

    performUpdate() {
        let itemToUpdate = this.items.find(item => item.id == this.model.id);
        if (itemToUpdate == undefined) {
            itemToUpdate = {};
            this.items.push(itemToUpdate);
        }

        this.updateObject(itemToUpdate, this.model);
    }

    updateObject(to, from) {
        to.id = from.id;
        to.code = from.code;
        to.description = from.description;
        to.siteCode = from.siteCode;
        to.locationCode = from.locationCode;
        to.condition = from.condition;
    }
}
