import { h, Component } from 'preact'
import { route } from 'preact-router'

export default class SubmitForm extends Component {
  state = {
    value: 'jantwel'
  }

  getRepos = event => {
    event.preventDefault()
    const { value } = this.state
    route(`/${value}`)
    // this.props.getRepos(value)
  }

  changeName = ({ target: { value } }) => this.setState({ value })

  render() {
    const { value } = this.state
    return (
      <form onSubmit={this.getRepos}>
        <label>Type Name</label>
        <input value={value} onChange={this.changeName} />
        <button type="submit">GET!</button>
      </form>
    )
  }
}
