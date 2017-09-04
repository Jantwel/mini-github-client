import { h, Component } from 'preact'
import request from '../../services/request'
import css from './style.css'

export default class Dialog extends Component {
  constructor() {
    super()
    this.handlePressEscape = this.closeByEscape.bind(this)
  }

  state = {
    loading: true
  }

  closeDialog = () => this.props.closeRepo(this.props.matches.name)
  closeByEscape = () => event.key === 'Escape' && this.closeDialog()

  getUrls = repo => [
    repo.url + '/contributors?per_page=3',
    repo.languages_url,
    repo.url + '/pulls?&sort=popularity&direction=desc&per_page=5'
  ]

  fetchRepo = async () => {
    const { matches: { name, repoName } } = this.props
    const { body: repo } = await request(
      `//api.github.com/repos/${name}/${repoName}`
    )
    const [contributors, languages, pulls] = await request.all(
      this.getUrls(repo)
    )

    this.setState({ loading: false, repo, contributors, languages, pulls })
  }

  componentWillMount() {
    this.fetchRepo()
    document.addEventListener('keydown', this.handlePressEscape)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePressEscape)
  }

  render({}, { loading, repo, contributors, pulls }) {
    return (
      !loading &&
      <div class={css.dialogWrapper}>
        <div class={css.backcover} onClick={this.closeDialog} />
        <div class={css.dialog}>
          <button class={css.closeBtn} onClick={this.closeDialog}>
            X
          </button>
          <h3 class={css.header}>
            {repo && repo.full_name}
          </h3>
          <div>
            <h4>Contributors</h4>
            {contributors &&
              contributors.map(({ login, url, contributions }) =>
                <div>
                  <a href={url}>
                    {login}
                  </a>
                  <span>
                    Contributions: {contributions}
                  </span>
                </div>
              )}
          </div>
          <div>
            <h4>Pull Requests</h4>
            {pulls &&
              pulls.map(({ title, url }) =>
                <div>
                  <a href={url}>
                    {title}
                  </a>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }
}
