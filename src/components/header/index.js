import { h, Component } from 'preact'
import style from './style.css'

export default class Header extends Component {
  render() {
    return (
      <header class={style.header}>
        <h1>GITHUB CLIENT</h1>
      </header>
    )
  }
}
