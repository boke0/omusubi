import {Component, ProviderComponent, Dispatcher, html} from '../../main.js';
import styles from './style.css';

class MainDispatcher extends Dispatcher {
  init() {
      return {
          select: 0,
          sounds: new Array(16).fill(0),
          name: 'label'
      }
  }
  async select(state, i) {
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        state.select = i;
        state.sounds[i] = i;
        resolve({...state});
      }, i*1000);
    });
  }
}

class MainComponent extends ProviderComponent {
  static get dispatcher() {
    return MainDispatcher;
  }
  static get styles() {
    return [styles];
  }
  render(state, dispatch){
    return html`
        <div id="title">
        </div>
        <div id='buttons'>
            ${state.sounds.map((s, i) => {
              return html`
                <sub-component
                    data-id=${i}
                    ?selected=${state.select == i}
                    @click=${e => dispatch('select', i)}
                >
                </sub-component>
            `})}
        </div>
    `;
  }
}

class SubDispatcher extends Dispatcher {
  init() {
    return {
      status: 0
    };
  }
}

class SubComponent extends Component {
  static get dispatcher() {
    return SubDispatcher;
  }
  render(state) {
    return html`
      <style> :host([selected]) { color: tomato; } </style>
      <div>${state.$context.sounds[this.dataset.id]}</div>
    `;
  }
}

customElements.define('main-component', MainComponent);
customElements.define('sub-component', SubComponent);
