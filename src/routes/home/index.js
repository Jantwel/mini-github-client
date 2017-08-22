import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import SubmitForm from '../../components/submit-form';
import RepoCard from '../../components/repo-card';
import style from './style';

@connect(state => state)
export default class Home extends Component {
	render() {
		const { repos: { repos } } = this.props;
		console.log('home: ', this.props);
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<SubmitForm />
				<div>
					{repos.map(
						({
							full_name: fullName,
							description,
							stargazers_count: stargazersCount,
							updated_at: updatedAt,
							language
						}) =>
							(<RepoCard
								name={fullName}
								description={description}
								stars={stargazersCount}
								updatedAt={updatedAt}
								language={language}
							/>)
					)}
				</div>
			</div>
		);
	}
}
