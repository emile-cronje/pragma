import {menuItems, quickItems} from './menu-items';
import {isMobile} from "pragma-views";
import {OnKeyApi} from 'pragma-api';
import {inject} from 'aurelia-dependency-injection'

@inject(OnKeyApi)
export class App {
    router = null;

    constructor(api) {
        this.menuItems = menuItems;
        this.quickItems = quickItems;
        api.initConnection("http://localhost:5000/", "Contoso", "Test");        
    }

    configureRouter(config, router) {
        config.title = 'Application Title';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: 'views/welcome/welcome', nav: true, title: 'Welcome' },
            { route: ["crud"], name: 'crud', moduleId: 'views/crud-example/crud-example', nav: true, title: 'Crud' },
            { route: ["test"], name: 'test', moduleId: 'views/test/test', nav: true, title: 'Test' }            
        ]);

        this.router = router;
    }

    attached() {
        if (isMobile()) {
            this.closeAssistant();
        }
    }

    closeAssistant() {
        this.assistant.au["assistant"].viewModel.isOpen = false;
    }
}