import { h, Component } from 'preact'
import Dialog from '../../components/dialog'

export default class Profile extends Component {
  // Note: `user` comes from the URL, courtesy of our router
  render({ repo, closeRepo, matches: { name: userName, repoName } }) {
    console.log('profile: ', this.props)
    return (
      <div>
        <Dialog
          repo={repo}
          user={userName}
          repoName={repoName}
          closeRepo={closeRepo}
        />
      </div>
    )
  }
}
