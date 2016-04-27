////
/// @group all
/// @author kmturley
////

import { bootstrap } from 'angular2/platform/browser';
import { Component } from 'angular2/core';
import { enableProdMode } from 'angular2/core';

import Tabs from './tabs/tabs';

@Component({
    selector: 'my-app',
    template: `
        <div class="section">
            <h1>Angular2 + JSPM + ES6 + Gulp</h1>
            <h2>Example {{ message }}</h2>
            <tabs>Loading tabs</tabs>
        </div>`,
    directives: [Tabs]
})
class App {
    constructor() {
        this.message = "showing what's possible!";
    }
};

//enableProdMode();
bootstrap(App);