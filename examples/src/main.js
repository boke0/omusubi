import {Component, html} from '../../main.js';

class TestComponent extends Component {
  init(){
    return {
      arr: ['']
    }
  }
  update(state) {
    return {
      arr: state.arr.concat([''])
    }
  }
  render(state){
    return html`
      <div id='he' @click=${e => this.dispatch('update')}>hhhhh</div>
      <ul>
        ${state.arr.map((_, i) => html`
          <li>${
            i%15 == 0
              ?'fizzbuzz'
              : i%5 == 0
                ? 'buzz'
                : i%3 == 0
                  ? 'fizz'
                  : i
          }</li>
        `)}
      </ul>
    `;
  }
}

customElements.define('test-component', TestComponent);
