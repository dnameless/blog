import CommentList from './components/CommentList'
import CommentForm from './components/CommentForm'

class CommentBox extends React.Component {
	constructor() {
		super()
		this.state = {data: []}
		this.commentsRef = defaultDatabase.ref('comments/')
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
		this.commentsRef.update(updates)
	}
	
	handleCommentDelete = index => {
		this.setState({data: this.state.data.filter((comment) => comment.id != index)})
		defaultDatabase.ref(`comments/${index}/`).remove()
	}

	listenToFirebaseComments = () => {
		this.commentsRef.on('child_added', (data) => {
			const comment = data.val()
			comment !== null && this.setState({data: this.state.data.concat(comment)})
		})
		this.commentsRef.on('child_removed', (data) => {
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

ReactDOM.render(<CommentBox/>, document.getElementById('react-app'))