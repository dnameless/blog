const {Motion, spring, TransitionMotion} = ReactMotion

var commentData = [
	{author: 'Waympus Loonger', text: 'look at this comment!'},
	{author: 'Donderk Sept', text: 'No, this comment is more interesting!'},
	{author: 'Lentfop Abdus', text: 'I can say a thing here?'},
	{author: 'Stenin Bumk', text: 'Why is wall though?'},
	{author: 'Stenin Bumk', text: 'Waldo*'},
	{author: 'Hastov Lennonbrook', text: 'H- How did a typo of Waldo turn into wall though???'},
	{author: 'Lentfop Abdus', text: '^ this guy'},
	{author: 'Stenin Bumk', text: 'It sounds similar!'},
	{author: 'Henchtop X. Splathurdin', text: 'y\'all are freaky.'},
	{author: 'Snecknope Antlebee', text: 'Guys guys guys!'},
	{author: 'Lentfop Abdus', text: 'Jeez what?'},
	{author: 'Snecknope Antlebee', text: 'so they say comedy is observation plus time, right?'},
	{author: 'xXx_Ethan_xXx', text: 'I\'ll bite.'},
	{author: 'xXx_Ethan_xXx', text: 'Yeah that\'s what they say...'},
	{author: 'Snecknope Antlebee', text: 'Yeah, but then I got to thinking. Jerry Sienfeld showed us that observation is also comedy!'},
	{author: 'Jaymus Flabbergasser', text: 'SEVENTEEN!!!!'},
	{author: 'Snecknope Antlebee', text: 'It\'s basic algebra.'},
	{author: 'Snecknope Antlebee', text: 'tragedy + time = comedy'},
	{author: 'Snecknope Antlebee', text: 'observations = comedy'},
	{author: 'Snecknope Antlebee', text: 'thus!!! tragedy = observation - time'},
	{author: 'Snecknope Antlebee', text: 'in lame-man-speak timeless observation is equal to tragedy'}
]

const springPreset = {
	wobbly: [120,11]
}



class CommentList extends React.Component {
	componentDidMount() {
		this.comDisplay = $('.comment-list')
	}
	componentDidUpdate() {
		let comHeight = this.comDisplay.outerHeight()
		let comScroll = this.comDisplay[0].scrollHeight
		
		this.comDisplay.stop().animate({'scrollTop': comScroll - comHeight}, 200)
	};
	getStyles() {
		let configs = {}
		this.props.data.forEach((val,index) => {
			configs[val.id] = {
				opacity: spring(1),
				top: spring(0, springPreset.wobbly)
			}
		})
		return configs
	};
	willEnter(key) {
		return {
			opacity: spring(0),
			top: spring(100, springPreset.wobbly)
		}
	};
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
								<div className='comment-node' author={comment.author} key={comment.id} style={style}>
									<div className='print-author'>
										{comment.author + ' - '}
									</div> 
									{comment.text}
								</div>
							)
						})}
					</div>
				}
			</TransitionMotion>
		)
	};
}

class CommentForm extends React.Component {
	constructor() {
		super()
		this.state = {author: '', text: '', canPost: 'disabled'}
	};
	handleAuthorChange = (e) =>{
		this.setState({author: e.target.value})
	};
	handleTextChange = (e) => {
		this.setState({text: e.target.value})
	};
	handleSubmit = (e) => {
		e.preventDefault()
		var author = this.state.author.trim(),
			text = this.state.text.trim()
		if(!text || !author) {
			return
		}
		this.props.onCommentSubmit({author: author, text: text})
		this.setState({text: ''})
	};
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
	};
};

class CommentBox extends React.Component {
	constructor() {
		super()
		this.state = {data: []}
	}
	componentDidMount() {
		this.addRandomComment()
	}
	handleCommentSubmit = (comment) => {
		comment['id'] = this.state.data.length + 1
		this.setState({data: this.state.data.concat(comment)})
	};
	addRandomComment = () => {
		this.handleCommentSubmit(commentData[0])
		commentData.splice(0,1)
		if(commentData.length > 0) {
			let cTime = Math.random() * 7000 + 500
			setTimeout(this.addRandomComment, cTime)
		}
	};
	render() {
		return (
			<div className='comment-box'>
				<h1>Comments</h1>
				
			</div>
		)
	};
}

React.render(
	<CommentBox/>,
	document.getElementById('react-app')
)