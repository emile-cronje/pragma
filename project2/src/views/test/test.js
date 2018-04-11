import {template} from './schema';
import {ViewModel} from 'pragma-views';
import {OnKeyApi} from 'pragma-api';
import {inject} from 'aurelia-dependency-injection'

@inject(OnKeyApi)
export class Test extends ViewModel {
    constructor(api) {
        super();
        this.schema = template;
        this.api = api;
    }

    disconnected() {
        delete this.api;
    }

    performAction() {
        this.loadStaffMember();
    }

    async loadStaffMember() {
        const dataResponse = await this.api.getModelAsync("StaffMembers", 5000001001);
    }
}