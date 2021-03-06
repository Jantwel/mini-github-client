import { h, Component } from 'preact'
import { getDate, getStars } from './helpers'
import languagesColors from './languages-colors.json'
import css from './style.scss'

export default class RepoCard extends Component {
  openRepo = () => this.props.openRepo(this.props.name)
  render({ full_name, description, stars, updatedAt, language, fork }) {
    return (
      <div class={css.card} onClick={this.openRepo}>
        <h3 class={css.name}>
          {full_name}
        </h3>
        {fork &&
          <div class={css.forkLabel}>
            <small>Fork</small>
          </div>}
        <p class={css.description}>
          {description}
        </p>
        <div class={css.additionalInfo}>
          {language &&
            <div class={css.language}>
              <span
                class={css.languageColor}
                style={{ backgroundColor: languagesColors[language] }}
              />
              <span>
                {language}
              </span>
            </div>}
          <div class={css.stars}>
            <svg
              aria-label="star"
              class="octicon octicon-star"
              height="16"
              role="img"
              version="1.1"
              viewBox="0 0 14 16"
              width="14"
            >
              <path
                fill-rule="evenodd"
                d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"
              />
            </svg>
            {getStars(stars)}
          </div>
          <div class={css.updatedDate}>
            Updated At: {getDate(updatedAt)}
          </div>
        </div>
      </div>
    )
  }
}
