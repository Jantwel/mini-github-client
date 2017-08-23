import { githubLinksParser } from '../util';

const SEARCH = '//api.github.com/users';

const getReposSuccess = ({ repos, lastPage }) => ({
	type: 'GET_REPOS',
	repos,
	lastPage
});

export const getRepos = (name, page) => dispatch =>
	fetch(`${SEARCH}/${name}/repos`)
		.then(response => {
			const lastPage = response.headers.get('Link')
				? githubLinksParser(response.headers.get('Link')).last
				: 1;

			return Promise.all([response.json(), lastPage]);
		})
		.then(([repos, lastPage]) => {
			dispatch(getReposSuccess({ repos, lastPage }));
		});
