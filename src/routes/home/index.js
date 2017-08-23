import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import SubmitForm from '../../components/submit-form';
import RepoStream from '../../components/repo-stream';
import style from './style';

@connect(state => state)
export default class Home extends Component {
	render() {
		const { repos: { repos } } = this.props;
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<SubmitForm />
				<RepoStream repos={repos} />
			</div>
		);
	}
}
