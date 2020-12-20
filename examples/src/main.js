import {Component, ProviderComponent, Dispatcher, html} from '../../main.js';
import styles from './style.css';

class MainComponent extends ProviderComponent {
  static get styles() {
    return [styles];
  }
  get providerId() {
    return 'main';
  }
  init() {
      return {
          select: 0,
          sounds: new Array(16).fill(0),
          name: 'label'
      }
  }
  async select({state}, i) {
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        state.select = i;
        state.sounds[i] = i;
        resolve({...state});
      }, i*1000);
    });
  }
  render({state, dispatch}){
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

class SubComponent extends Component {
  init() {
    return {
      status: 0
    };
  }
  render({state, $ctx}) {
    return html`
      <style> :host([selected]) { color: tomato; } </style>
      <div>${$ctx('main').state.sounds[this.dataset.id]}</div>
    `;
  }
}

customElements.define('main-component', MainComponent);
customElements.define('sub-component', SubComponent);
