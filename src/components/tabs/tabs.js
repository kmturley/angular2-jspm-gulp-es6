////
/// @group overlay
/// @author kmturley
////

//import css from './tabs.css!css';
import tpl from './tabs.tpl!text';

import { Component } from 'angular2/core';
import { Http, HTTP_PROVIDERS } from 'angular2/http';

@Component({
    selector: 'tabs',
    template: tpl,
    viewProviders: [HTTP_PROVIDERS]
})

class Tabs {
    static get parameters() {
        return [[Http]];
    }
    constructor(http:Http) {
        // example
        console.log('Tabs', http);
    }
    introduction(name) {
        /**
         * @param {string} name A person's name
         * @return {string} Introduction to the person
         */
        return 'Hello ' + name;
    }
}

export default Tabs;