import { h, Component } from 'preact'
import RepoStream from '../../components/repo-stream'
// import style from './style.css'

export default class Home extends Component {
  componentWillMount() {
    const { matches: { name }, fetchRepos } = this.props
    fetchRepos(name)
  }

  componentWillReceiveProps({ matches: { name: nextName } }) {
    const { matches: { name }, fetchRepos } = this.props
    if (name !== nextName) {
      fetchRepos(nextName)
    }
  }

  render() {
    const { repos, openRepo } = this.props
    return (
      <div>
        <RepoStream repos={repos} openRepo={openRepo} />
      </div>
    )
  }
}
