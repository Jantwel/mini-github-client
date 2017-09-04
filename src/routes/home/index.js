import { h, Component } from 'preact'
import RepoStream from '../../components/repo-stream'
// import style from './style.css'

export default class Home extends Component {
  render() {
    const { repos, openRepo, filters } = this.props
    return (
      <div>
        <RepoStream repos={repos} filters={filters} openRepo={openRepo} />
      </div>
    )
  }
}
