import { h, Component } from 'preact';

export default class SubmitForm extends Component {
	state = {
		value: 'facebook'
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
