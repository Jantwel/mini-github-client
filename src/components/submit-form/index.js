import { h, Component } from 'preact'
import { route } from 'preact-router'
import css from './style.scss'
const PUBLIC_PATH =
  process.env.NODE_ENV === 'development' ? '/' : '/mini-github-client/'
export default class SubmitForm extends Component {
  state = {
    value: this.props.username
  }

  getRepos = event => {
    event.preventDefault()
    const url = new URL(location.href)
    const { value } = this.state
    const { log } = console
    log('getREpo s: ', { url, value })
    route(`${PUBLIC_PATH}${value}`)
  }

  changeName = ({ target: { value } }) => this.setState({ value })

  render({ username }, { value }) {
    return (
      <form onSubmit={this.getRepos} class={css.form}>
        <input
          class={css.input}
          value={username || value}
          onChange={this.changeName}
          placeholder="Username"
        />
        <button type="submit" class={css.submitButton}>
          Load Repos
        </button>
      </form>
    )
  }
}
