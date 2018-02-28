export default class CommentForm extends React.Component {
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