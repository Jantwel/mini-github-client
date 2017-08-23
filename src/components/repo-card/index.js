import { h, Component } from 'preact';
import css from './style';

export default class RepoCard extends Component {
	handleClick = event => {
		console.log('click event: ', event);
	};

	render() {
		const { name, description, stars, updatedAt, language } = this.props;
		return (
			<div
				class={css.card}
				ref={ref => (this.card = ref)}
				onClick={this.handleClick}
			>
				<h3 class={css.name}>
					{name}
				</h3>
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
		);
	}
}
