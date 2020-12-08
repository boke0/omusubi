import {Component, html, defineComponent} from '../../main.js';
import feature_style from './scss/feature.scss';

class Feature extends Component {
  static get styles() {
    return [feature_style];
  }
  render() {
    return html`
      <slot name='title'></slot>
      <slot name='content'></slot>
    `;
  }
}
defineComponent('om-feature')(Feature);


