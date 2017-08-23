import { h, Component } from 'preact';
import SubmitForm from '../../components/submit-form';
import RepoStream from '../../components/repo-stream';
import style from './style';

export default class Home extends Component {
	render() {
		const { repos, getRepos } = this.props;
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<SubmitForm getRepos={getRepos} />
				<RepoStream repos={repos} />
			</div>
		);
	}
}
