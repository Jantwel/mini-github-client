import { h, Component } from 'preact'
import request from '../../services/request'
import Loader from 'components/loader'
import languagesColors from '../repo-card/languages-colors.json'
import css from './style.scss'

const getData = url => fetch(url).then(response => response.json())

const getLanguageSize = (result, language) => result + language[1]

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

  sortLanguages = (prev, next) => {
    if (prev[1] < next[1]) {
      return 1
    }
    if (prev[1] > next[1]) {
      return -1
    }
    return 0
  }

  getLanguages = languages => {
    const sortedLanguages = Object.entries(languages).sort(this.sortLanguages)
    const fullSize = sortedLanguages.reduce(getLanguageSize, 0)

    const mostUsedLanguages = sortedLanguages
      .filter(([, value]) => value >= 1024)
      .filter((item, index) => index < 6)

    const otherLanguages = sortedLanguages
      .slice(
        sortedLanguages.indexOf(
          mostUsedLanguages[mostUsedLanguages.length - 1]
        ) + 1
      )
      .reduce(getLanguageSize, 0)

    return [
      ...mostUsedLanguages.map(([key, size]) => [
        key,
        (size / fullSize * 100).toFixed(1)
      ]),
      ['Other', (otherLanguages / fullSize * 100).toFixed(1)]
    ]
  }

  render({}, { loading, repo, languages = [], contributors, pulls }) {
    const filteredLanguages = this.getLanguages(languages)

    return (
      <div class={css.dialogWrapper}>
        <div class={css.backcover} onClick={this.closeDialog} />
        <div class={css.dialog}>
          <button class={css.closeBtn} onClick={this.closeDialog}>
            X
          </button>
          {loading
            ? <Loader />
            : <div>
              <h3 class={css.header}>
                {repo && repo.full_name}
              </h3>
              {repo.fork &&
                  <p>
                    Forked from{' '}
                    <a href={repo.parent.html_url} target="_blank">
                      {repo.parent.full_name}
                    </a>
                  </p>}
              <div>
                <h4>Contributors</h4>
                <div class={css.contributors}>
                  {contributors &&
                      contributors.map(
                        ({ login, avatar_url, html_url, contributions }) =>
                          <div class={css.contributor}>
                            <img
                              class={css.contributorAvatar}
                              src={avatar_url}
                              alt={`Contributor avatar: ${login}`}
                            />
                            <a
                              href={html_url}
                              class={css.contributor__link}
                              target="_blank"
                            >
                              {login}
                            </a>
                            <span>
                              Contributions: {contributions}
                            </span>
                          </div>
                      )}
                </div>
              </div>
              <div>
                <h4>Languages</h4>
                <div class={css.languagesList}>
                  {filteredLanguages &&
                      filteredLanguages.map(([name, size]) =>
                        <div class={css.language}>
                          <div class={css.languageDescription}>
                            <span>
                              {name}: {size}%
                            </span>
                          </div>
                          <div class={css.languageGraph}>
                            <div
                              style={{
                                width: `${size}%`,
                                height: '100%',
                                backgroundColor: languagesColors[name]
                              }}
                            />
                          </div>
                        </div>
                      )}
                </div>
              </div>
              {pulls &&
                  <div>
                    <h4>Pull Requests</h4>
                    {pulls.map(({ title, html_url }) =>
                      <div>
                        <a href={html_url} target="_blank">
                          {title}
                        </a>
                      </div>
                    )}
                  </div>}
            </div>}
        </div>
      </div>
    )
  }
}
