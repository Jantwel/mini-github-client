import { h, Component } from 'preact'
import { Link } from 'preact-router'
import css from './style.scss'

export default class RepoCard extends Component {
  openRepo = ({ id, name }) => event => {
    event.preventDefault()
    this.props.openRepo({ id, name })
  }

  render() {
    const {
      id,
      name,
      description,
      stars,
      updatedAt,
      language,
      fork
    } = this.props
    return (
      <div class={css.card} ref={ref => (this.card = ref)}>
        <Link class={css.name} href={`/${name}`}>
          {name}
        </Link>
        {fork &&
          <div>
            <small>Fork</small>
          </div>}
        <p>
          {description}
        </p>
        <div class={css.additionalInfo}>
          <div>
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
            {stars}
          </div>
          <div>
            Updated At: {updatedAt}
          </div>
          <div>
            {language}
          </div>
        </div>
      </div>
    )
  }
}
