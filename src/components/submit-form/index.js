import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../../util';
import reducers from '../../reducers';
import * as actions from '../../actions';

// @connect(reducers, bindActions(actions))
export default class SubmitForm extends Component {
	state = {
		value: ''
	};

	getRepos = event => {
		event.preventDefault();
		const { value } = this.state;
		this.props.getRepos(value);
	};

	changeName = ({ target: { value } }) => this.setState({ value });

	render() {
		const { value } = this.state;
		return (
			<form onSubmit={this.getRepos}>
				<label>Type Name</label>
				<input value={value} onChange={this.changeName} />
				<button type="submit">GET!</button>
			</form>
		);
	}
}
