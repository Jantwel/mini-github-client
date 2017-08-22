import { githubLinksParser } from '../util';

const SEARCH = '//api.github.com/search/repositories';

const getReposSuccess = ({ repos, lastPage }) => ({
	type: 'GET_REPOS',
	repos,
	lastPage
});

export const getRepos = (name, page) => dispatch =>
	fetch(`${SEARCH}?per_page=30&p=${page ? page : 1}&q=${name}`)
		.then(response => {
			const lastPage = response.headers.get('Link')
				? githubLinksParser(response.headers.get('Link')).last
				: 1;

			return Promise.all([response.json(), lastPage]);
		})
		.then(([json, lastPage]) => {
			const { items } = json;
			console.log('success: ', items, json);
			dispatch(getReposSuccess({ repos: items, lastPage }));
		});
