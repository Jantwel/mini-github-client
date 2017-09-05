import { h, Component } from 'preact'
import request from '../../services/request'
import css from './style.css'

const getData = url => fetch(url).then(response => response.json())

export default class Dialog extends Component {
  constructor() {
    super()
    this.handlePressEscape = this.closeByEscape.bind(this)
  }

  state = {
    loading: true
  }

  closeDialog = () => this.props.closeRepo()
  closeByEscape = () => event.key === 'Escape' && this.closeDialog()

  getUrls = repo =>
    [
      repo.url + '/contributors?per_page=3',
      repo.languages_url,
      repo.url + '/pulls?&sort=popularity&direction=desc&per_page=5'
    ].map(getData)

  fetchRepo = async () => {
    const { name, repoName } = this.props
    const { body: repo } = await request(
      `//api.github.com/repos/${name}/${repoName}`
    )

    Promise.all(this.getUrls(repo)).then(([contributors, languages, pulls]) =>
      this.setState({ loading: false, repo, contributors, languages, pulls })
    )
  }

  componentWillMount() {
    this.fetchRepo()
    document.addEventListener('keydown', this.handlePressEscape)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePressEscape)
  }

  render({}, { loading, repo, contributors, pulls }) {
    console.log('dialog props: ', this.props)
    return (
      <div class={css.dialogWrapper}>
        <div class={css.backcover} onClick={this.closeDialog} />
        <div class={css.dialog}>
          <button class={css.closeBtn} onClick={this.closeDialog}>
            X
          </button>
          {loading
            ? <div>LOADING...</div>
            : <div>
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
            </div>}
        </div>
      </div>
    )
  }
}
