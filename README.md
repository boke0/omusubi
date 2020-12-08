Omusubi.js
===

<div align='center'>
    <img src='https://user-images.githubusercontent.com/48381296/101445678-465e5700-3965-11eb-9e6e-d64e277fd457.png' width='200'/><br>
</div>

View component library using WebComponents.

## Usage

```javascript
import {Component, html} from 'omusubi';
class FizzBuzz extends Component {
    init() {
        return {
            arr: [0]
        }
    }
    update(state) {
        return {
            arr: state.arr.concat([state.arr.length]);
        }
    }
    render(state) {
        return html`
            <h1>Hello, FizzBuzz!</h1>
            <button @click=${e => this.dispatch('update')}>Count!</button>
            <ul>
                ${state.arr.map(i => html`
                    <li>${i}</li>
                `)}
            </ul>
        `
    }
}
defineComponent('fizz-buzz')(FizzBuzz);
```

```html
<fizz-buzz></fizz-buzz>
```

## Install

You can install this by using npm:

```bash
$ npm install --save-dev boke0/omusubi
```
<!--
Or, you can use it by CDN:

```javascript
import {Component, html, defineComponent} from '//unpkg.com/omusubi/omusubi.min.js';

...
```
-->

## Features
### Cooperate with Vanilla
You do not need any compile process to define component. The components you defined are able to be used in native HTML.

### No Virtual DOM
Insted of Virtual DOM diffing, Omusubi.js uses Value diffing; check diff if there is possibility of changing.

### The Elm Architecture
Omusubi.js is desined while respecting The Elm Architecture. You can make components which have less side-effects.
