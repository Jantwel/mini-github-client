import { h, Component } from 'preact'
import { route } from 'preact-router'
import css from './style.scss'

export default class SubmitForm extends Component {
  state = {
    value: this.props.username
  }

  getRepos = event => {
    event.preventDefault()
    const url = new URL(location.href)
    const { value } = this.state
    console.log('getREpo s: ', {url, value})
    route(`${url.pathname}${value}`)
    // route(`${url.href}?${value}`)
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
