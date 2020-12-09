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
  dup(state, i) {
    state.arr[i] = state.arr[i] + state.arr[i];
    return {
      arr: state.arr
    }
  }
  render(state){
    console.log(state);
    return html`
      <div id='he' @click=${e => this.dispatch('update')}>hhhhh</div>
      <ul>
        ${state.arr.map((_, i) => html`
          <li
            @click=${e => this.dispatch('dup', i)}
            class=${
            i%15 == 0
              ?'fizzbuzz'
              : i%5 == 0
                ? 'buzz'
                : i%3 == 0
                  ? 'fizz'
                  : i
            } data-id=${i%2==0?'even':'odd'}>
          ${
            i%15 == 0
              ?'fizzbuzz'
              : i%5 == 0
                ? 'buzz'
                : i%3 == 0
                  ? 'fizz'
                  : i
            }
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('test-component', TestComponent);
