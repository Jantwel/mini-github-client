import { h, Component } from 'preact'
import { route } from 'preact-router'

export default class SubmitForm extends Component {
  state = {
    value: this.props.username
  }

  getRepos = event => {
    event.preventDefault()
    const { value } = this.state
    route(`/${value}`)
  }

  changeName = ({ target: { value } }) => this.setState({ value })

  render({username}, {value}) {
    return (
      <form onSubmit={this.getRepos}>
        <label>Type Name</label>
        <input value={username || value} onChange={this.changeName} />
        <button type="submit">GET!</button>
      </form>
    )
  }
}
