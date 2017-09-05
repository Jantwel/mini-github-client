import { h } from 'preact'
import css from './style.scss'

export default ({ children, title }) =>
  <div class={css.category}>
    <p>
      {title}
    </p>
    {children}
  </div>
