import { h, Component } from 'preact'
import RepoStream from '../../components/repo-stream'
// import style from './style.css'

export default class Home extends Component {
  componentWillMount() {
    const { matches: { name }, fetchRepos } = this.props
    name && fetchRepos(name)
  }

  componentWillReceiveProps(nextProps) {
    const { matches: { name: nextName } } = nextProps
    const { matches: { name }, fetchRepos } = this.props
    // console.log('will receive props: ', {
    //   nextName,
    //   name,
    //   props: this.props,
    //   nextProps
    // })
    if (name !== nextName && nextName.trim()) {
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
