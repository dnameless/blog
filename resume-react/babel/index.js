const {Motion, spring, TransitionMotion} = ReactMotion

// Helpers
const springPreset = { 
	wobbly: [120,11] 
}

const timeStamp = () => {
  let options = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute:'2-digit'
  };
  let now = new Date().toLocaleString('en-US', options);
  return now;
};

// Components
class CommentList extends React.Component {
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

	render() {
		return (
			<TransitionMotion
				styles={this.getStyles()}
				willEnter={this.willEnter}
				willLeave={this.willLeave}>
				{interp =>
					<div className='comment-list'>
						{this.props.data.map((comment, i) => {
							const {...style} = interp[i + 1];
							return (
								<div className='comment-node' key={comment.id} style={style}>
									<div className='print-author'>
										{`${comment.author} - ${comment.datetime}`}
									</div> 
									{comment.text}
								</div>
							)
						})}
					</div>
				}
			</TransitionMotion>
		)
	}
}

class CommentForm extends React.Component {
	constructor() {
		super()
		this.state = {author: '', text: '', canPost: 'disabled'}
	}

	handleAuthorChange(e) {
		this.setState({author: e.target.value})
	}

	handleTextChange(e) {
		this.setState({text: e.target.value})
	}

	handleSubmit(e) {
		e.preventDefault()
		var author = this.state.author.trim(),
			text = this.state.text.trim()
		if(!text || !author) {
			return
		}
		this.props.onCommentSubmit({
			author: author, 
			text: text,
			datetime: timeStamp()
		})
		this.setState({text: ''})
	}

	render() {
		return (
			<form className='comment-form' onSubmit={this.handleSubmit}>
				<input
					type='text'
					placeholder='Name'
					value={this.state.author}
					onChange={this.handleAuthorChange}
					maxLength='20'
					className='name-input'
					required
				/>
				<input 
					type='text'
					placeholder='Comment'
					value={this.state.text}
					onChange={this.handleTextChange}
				/>
				<input 
					type='submit'
					value='Post'
					disabled={!this.state.author.trim() || !this.state.text.trim()}
				/>
			</form>
		)
	}
}

class CommentBox extends React.Component {
	constructor() {
		super()
		this.state = {data: []}
		this.commentsRef = defaultDatabase.ref('comments/')
	}

	componentDidMount() {
		this.listenToFirebaseComments()
		this.getFirebaseComments()
	}

	handleCommentSubmit(comment) {
		comment['id'] = this.state.data.length + 1
		this.setState({data: this.state.data.concat(comment)})
		// post firebase comments
	}

	listenToFirebaseComments() {
		this.commentsRef.on('child_added', (snapshot) => {
			this.handleCommentSubmit(snapshot.val())
		})
	}

	getFirebaseComments() {
		this.commentsRef.once('value').then((snapshot) => {
			const commentsList = snapshot.val()
			if (commentsList !== null) {
				this.state = {data: commentsList}
			}
			console.log(commentsList)
		})
	}

	render() {
		return (
			<div className='comment-box'>
				<h1>Comments</h1>
				<CommentList data={this.state.data}/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		)
	}
}

ReactDOM.render(
	<CommentBox/>,
	document.getElementById('react-app')
)