import { Component } from 'angular2/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Angular2 + Jspm + ES6 + Gulp</h1>
    <h2>Example {{ message }}</h2>
  `
})
export default class App {
  constructor() {
    this.message = "showing what's possible!";
  }
};