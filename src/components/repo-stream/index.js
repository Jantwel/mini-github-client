import { h, Component } from 'preact'
import RepoCard from '../../components/repo-card'

export default class RepoStream extends Component {
  render({ repos, openRepo }) {
    return (
      <div ref={ref => (this.stream = ref)}>
        <h2>Stream</h2>
        {repos.map(
          ({
            id,
            full_name,
            name,
            description,
            stargazers_count: stars,
            pushed_at: updatedAt,
            language,
            fork,
            topics
          }) =>
            <RepoCard
              {...{
                id,
                full_name,
                name,
                description,
                stars,
                updatedAt,
                language,
                fork,
                topics,
                openRepo
              }}
            />
        )}
      </div>
    )
  }
}
