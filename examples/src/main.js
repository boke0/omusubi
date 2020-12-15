import {Component, ProviderComponent, html} from '../../main.js';
import styles from './style.css';

class MainComponent extends ProviderComponent {
  static get styles() {
    return [styles];
  }
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
  render(state){
    console.log(this.constructor.name, 'render');
    return html`
        <div id="title">
        </div>
        <div id='buttons'>
            ${state.sounds.map((s, i) => {
              return html`
                <sub-component
                    data-id=${i}
                    ?selected=${state.select == i}
                    @click=${e => this.dispatch('select', i)}
                >
                </sub-component>
            `})}
        </div>
    `;
  }
}

class SubComponent extends Component {
  render(state) {
    return html`
      <style> :host([selected]) { color: tomato; } </style>
      <div>${state.$context.sounds[this.dataset.id]}</div>
      `;
  }
}

customElements.define('main-component', MainComponent);
customElements.define('sub-component', SubComponent);
