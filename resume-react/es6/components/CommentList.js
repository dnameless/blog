const {Motion, spring, TransitionMotion} = ReactMotion
const springPreset = { 
	wobbly: [120,11] 
}

export default class CommentList extends React.Component {
	componentDidMount() {
		this.comDisplay = $('.comment-list')
	}

	componentDidUpdate() {
		let comHeight = this.comDisplay.outerHeight()
		let comScroll = this.comDisplay[0].scrollHeight
		this.comDisplay.stop().animate({'scrollTop': comScroll - comHeight}, 200)
	}

	getStyles() {
		let configs = {}
		this.props.data.forEach((val,index) => {
			configs[val.id] = {
				opacity: spring(1),
				top: spring(0, springPreset.wobbly)
			}
		})
		return configs
	}

	willEnter(key) {
		return {
			opacity: spring(0),
			top: spring(100, springPreset.wobbly)
		}
	}

	deleteComment = index => {
		return (e) => {
			e.preventDefault()
			this.props.onCommentDelete(index)
			defaultDatabase.ref(`comments/${index}/`).remove()
		}
	}

	render() {
		return (
			<TransitionMotion
				styles={this.getStyles()}
				willEnter={this.willEnter}
				willLeave={this.willLeave}>
				{interp =>
					<div className='comment-list'>
						{this.props.data
							.sort((a, b) => (new Date(a.datetime)) - (new Date(b.datetime)))
							.map((comment, i) => {
								const {...style} = interp[i + 1]
								const user = firebase.auth().currentUser
								return (
									<div className='comment-node' key={i} style={style}>
										{ comment.photoURL && 
											<div className='photo'><img src={comment.photoURL}/></div> 
										}
										{ comment.userId && user && comment.userId == user.uid && 
											<div onClick={this.deleteComment(comment.id)} className="delete-comment">Delete</div>
										}
										<div className="comment-text">
											<div className='author'>{`${comment.author} - ${comment.datetime}`}</div>
											{comment.text}
										</div>
									</div>
								)
						})}
					</div>
				}
			</TransitionMotion>
		)
	}
}