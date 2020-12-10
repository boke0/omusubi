import {Component, html} from '../../main.js';

class TestComponent extends Component {
  init() {
      return {
          select: 0,
          sounds: new Array(16).fill(0),
          name: 'label'
      }
  }
  select(state, i) {
      state.select = i;
      return state;
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
                ></button>
            `})}
        </div>
    `;
  }
}

customElements.define('test-component', TestComponent);
