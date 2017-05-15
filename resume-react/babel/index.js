const {Motion, spring, TransitionMotion} = ReactMotion
const commentsRef = defaultDatabase.ref('comments/')

// Helpers
const springPreset = { 
	wobbly: [120,11] 
}

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

class CommentForm extends React.Component {
	constructor() {
		super()
		this.state = {author: '', text: ''}
	}

	componentDidMount() {
		this.user = firebase.auth().currentUser
	}

	handleAuthorChange = e => {
		this.setState({author: e.target.value})
	}

	handleTextChange = e => {
		this.setState({text: e.target.value})
	}

	handleSubmit = e => {
		e.preventDefault()
		const author = this.state.author.trim(),
			  text = this.state.text.trim(),
			  user = firebase.auth().currentUser
		if(!text || !author) {
			return
		}
		this.props.onCommentSubmit({
			author: user ? user.displayName : author, 
			text: text,
			datetime: (new Date()).toLocaleString('en-US'),
			photoURL: user ? user.photoURL : false,
			userId: user ? user.uid : false
		})
		this.setState({text: ''})
	}

	socialSignIn = (loginMethod) => {
		return () => {
			let provider;
			switch (loginMethod) {
				case "facebook": 
					provider = new firebase.auth.FacebookAuthProvider()
					break
				case "twitter": 
					provider = new firebase.auth.TwitterAuthProvider()
					break
				case "google": 
					provider = new firebase.auth.GoogleAuthProvider()
					break
			}
			if (!provider) {
				console.log("No valid external login method given.")
				return
			}
			firebase.auth().signInWithPopup(provider).then(result => {
				this.user = result.user;
				this.setState({author: this.user.displayName})
				this.props.refreshData()
			}).catch(error => {
				console.log(error)
			});
		}
	}

	socialSignOut = () => {
		firebase.auth().signOut()
		.then(() => {
			console.log("Logged out successfully")
			this.props.refreshData()
			this.user = firebase.auth().currentUser
			this.setState({author: ''})
		})
		.catch(error => console.log(error))
	}

	render() {
		return (<div>
				<form className='comment-form' onSubmit={this.handleSubmit}>
					<div className='social-login'>
						<input
							type='text'
							placeholder='Name'
							value={firebase.auth().currentUser ? firebase.auth().currentUser.displayName : this.state.author}
							onChange={this.handleAuthorChange}
							maxLength='20'
							className='name-input'
							required
						/>  
						{ firebase.auth().currentUser
						? <div className='signout' onClick={this.socialSignOut}>Sign out</div> 
						: <div>
							<span>Or Sign in With</span>
							<a onClick={this.socialSignIn('twitter')} className="icon-button twitter"><i className="fa fa-twitter"></i><span></span></a>
							<a onClick={this.socialSignIn('facebook')} className="icon-button facebook"><i className="fa fa-facebook"></i><span></span></a>
							<a onClick={this.socialSignIn('google')} className="icon-button google-plus"><i className="fa fa-google"></i><span></span></a>
						  </div>
						}
					</div>
					<input 
						type='text'
						placeholder='Comment'
						value={this.state.text}
						onChange={this.handleTextChange}
					/>
					<input 
						type='submit'
						value='Post'
						disabled={!this.state.author.trim().length || !this.state.text.trim().length }
					/>
				</form>
			</div>
		)
	}
}

class CommentBox extends React.Component {
	constructor() {
		super()
		this.state = {data: []}
	}

	componentDidMount() {
		this.listenToFirebaseComments()
	}

	handleCommentSubmit = comment => {
		const newId = `${Math.floor(Math.random() * 100000)}-${this.state.data.length + 1}`
		let updates = {}
		comment['id'] = newId
		updates[newId] = comment
		this.setState({data: this.state.data.concat(comment)})
		commentsRef.update(updates)
	}
	
	handleCommentDelete = index => {
		this.setState({data: this.state.data.filter((comment) => comment.id != index)})
		defaultDatabase.ref(`comments/${index}/`).remove()
	}

	listenToFirebaseComments = () => {
		commentsRef.on('child_added', (data) => {
			const comment = data.val()
			comment !== null && this.setState({data: this.state.data.concat(comment)})
		})
		commentsRef.on('child_removed', (data) => {
			const comment = data.val()
			comment !== null && this.handleCommentDelete(comment.id)
		})
	}

	refreshData = () => {
		this.setState(this.state)
	}

	render() {
		return (
			<div className='comment-box'>
				<h1>Comments</h1>
				<CommentList data={this.state.data} onCommentDelete={this.handleCommentDelete} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} refreshData={this.refreshData} />
			</div>
		)
	}
}

ReactDOM.render(
	<CommentBox/>,
	document.getElementById('react-app')
)