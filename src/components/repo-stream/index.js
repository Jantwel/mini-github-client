import { h, Component } from 'preact';
import RepoCard from '../../components/repo-card';

export default class RepoStream extends Component {
	render() {
		const { repos } = this.props;
		return (
			<div ref={ref => (this.stream = ref)}>
				<h2>Stream</h2>
				{repos.map(
					({
						full_name: name,
						description,
						stargazers_count: stars,
						updated_at: updatedAt,
						language
					}) =>
						<RepoCard {...{ name, description, stars, updatedAt, language }} />
				)}
			</div>
		);
	}
}
