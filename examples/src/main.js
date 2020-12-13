import {Component, html} from '../../main.js';

class TestComponent extends Component {
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
        resolve(state);
      }, i*1000);
    });
  }
  render(state){
    return html`
        <div id="title">
        </div>
        <div id='buttons'>
            ${state.sounds.map((s, i) => {
              return html`
                <button
                    data-id=${i}
                    ?selected=${state.select == i}
                    @click=${e => this.dispatch('select', i)}
                >
                  ${i}
                </button>
            `})}
        </div>
    `;
  }
}

customElements.define('test-component', TestComponent);
