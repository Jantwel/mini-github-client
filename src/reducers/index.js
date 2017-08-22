const INITIAL = {
	repos: [],
	lastPage: 1
};

export const repos = (state = INITIAL, action) => {
	switch (action.type) {
		case 'GET_REPOS': {
			return {
				repos: action.repos,
				lastPage: action.lastPage
			};
		}
		default:
			return state;
	}
};
