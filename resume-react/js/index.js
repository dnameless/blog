'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ReactMotion = ReactMotion;
var Motion = _ReactMotion.Motion;
var spring = _ReactMotion.spring;
var TransitionMotion = _ReactMotion.TransitionMotion;

var commentData = [{ author: 'Waympus Loonger', text: 'look at this comment!' }, { author: 'Donderk Sept', text: 'No, this comment is more interesting!' }, { author: 'Lentfop Abdus', text: 'I can say a thing here?' }, { author: 'Stenin Bumk', text: 'Why is wall though?' }, { author: 'Stenin Bumk', text: 'Waldo*' }, { author: 'Hastov Lennonbrook', text: 'H- How did a typo of Waldo turn into wall though???' }, { author: 'Lentfop Abdus', text: '^ this guy' }, { author: 'Stenin Bumk', text: 'It sounds similar!' }, { author: 'Henchtop X. Splathurdin', text: 'y\'all are freaky.' }, { author: 'Snecknope Antlebee', text: 'Guys guys guys!' }, { author: 'Lentfop Abdus', text: 'Jeez what?' }, { author: 'Snecknope Antlebee', text: 'so they say comedy is observation plus time, right?' }, { author: 'xXx_Ethan_xXx', text: 'I\'ll bite.' }, { author: 'xXx_Ethan_xXx', text: 'Yeah that\'s what they say...' }, { author: 'Snecknope Antlebee', text: 'Yeah, but then I got to thinking. Jerry Sienfeld showed us that observation is also comedy!' }, { author: 'Jaymus Flabbergasser', text: 'SEVENTEEN!!!!' }, { author: 'Snecknope Antlebee', text: 'It\'s basic algebra.' }, { author: 'Snecknope Antlebee', text: 'tragedy + time = comedy' }, { author: 'Snecknope Antlebee', text: 'observations = comedy' }, { author: 'Snecknope Antlebee', text: 'thus!!! tragedy = observation - time' }, { author: 'Snecknope Antlebee', text: 'in lame-man-speak timeless observation is equal to tragedy' }];

var springPreset = {
	wobbly: [120, 11]
};

var CommentList = function (_React$Component) {
	_inherits(CommentList, _React$Component);

	function CommentList() {
		_classCallCheck(this, CommentList);

		return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	}

	CommentList.prototype.componentDidMount = function componentDidMount() {
		this.comDisplay = $('.comment-list');
	};

	CommentList.prototype.componentDidUpdate = function componentDidUpdate() {
		var comHeight = this.comDisplay.outerHeight();
		var comScroll = this.comDisplay[0].scrollHeight;

		this.comDisplay.stop().animate({ 'scrollTop': comScroll - comHeight }, 200);
	};

	CommentList.prototype.getStyles = function getStyles() {
		var configs = {};
		this.props.data.forEach(function (val, index) {
			configs[val.id] = {
				opacity: spring(1),
				top: spring(0, springPreset.wobbly)
			};
		});
		return configs;
	};

	CommentList.prototype.willEnter = function willEnter(key) {
		return {
			opacity: spring(0),
			top: spring(100, springPreset.wobbly)
		};
	};

	CommentList.prototype.render = function render() {
		var _this2 = this;

		return React.createElement(
			TransitionMotion,
			{
				styles: this.getStyles(),
				willEnter: this.willEnter,
				willLeave: this.willLeave },
			function (interp) {
				return React.createElement(
					'div',
					{ className: 'comment-list' },
					_this2.props.data.map(function (comment, i) {
						var style = _objectWithoutProperties(interp[i + 1], []);

						return React.createElement(
							'div',
							{ className: 'comment-node', author: comment.author, key: comment.id, style: style },
							React.createElement(
								'div',
								{ className: 'print-author' },
								comment.author + ' - '
							),
							comment.text
						);
					})
				);
			}
		);
	};

	return CommentList;
}(React.Component);

var CommentForm = function (_React$Component2) {
	_inherits(CommentForm, _React$Component2);

	function CommentForm() {
		_classCallCheck(this, CommentForm);

		var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

		_this3.handleAuthorChange = function (e) {
			_this3.setState({ author: e.target.value });
		};

		_this3.handleTextChange = function (e) {
			_this3.setState({ text: e.target.value });
		};

		_this3.handleSubmit = function (e) {
			e.preventDefault();
			var author = _this3.state.author.trim(),
			    text = _this3.state.text.trim();
			if (!text || !author) {
				return;
			}
			_this3.props.onCommentSubmit({ author: author, text: text });
			_this3.setState({ text: '' });
		};

		_this3.state = { author: '', text: '', canPost: 'disabled' };
		return _this3;
	}

	CommentForm.prototype.render = function render() {
		return React.createElement(
			'form',
			{ className: 'comment-form', onSubmit: this.handleSubmit },
			React.createElement('input', {
				type: 'text',
				placeholder: 'Name',
				value: this.state.author,
				onChange: this.handleAuthorChange,
				maxLength: '20',
				className: 'name-input',
				required: true
			}),
			React.createElement('input', {
				type: 'text',
				placeholder: 'Comment',
				value: this.state.text,
				onChange: this.handleTextChange
			}),
			React.createElement('input', {
				type: 'submit',
				value: 'Post',
				disabled: !this.state.author.trim() || !this.state.text.trim()
			})
		);
	};

	return CommentForm;
}(React.Component);

;

var CommentBox = function (_React$Component3) {
	_inherits(CommentBox, _React$Component3);

	function CommentBox() {
		_classCallCheck(this, CommentBox);

		var _this4 = _possibleConstructorReturn(this, _React$Component3.call(this));

		_this4.handleCommentSubmit = function (comment) {
			comment['id'] = _this4.state.data.length + 1;
			_this4.setState({ data: _this4.state.data.concat(comment) });
		};

		_this4.addRandomComment = function () {
			_this4.handleCommentSubmit(commentData[0]);
			commentData.splice(0, 1);
			if (commentData.length > 0) {
				var cTime = Math.random() * 7000 + 500;
				setTimeout(_this4.addRandomComment, cTime);
			}
		};

		_this4.state = { data: [] };
		return _this4;
	}

	CommentBox.prototype.componentDidMount = function componentDidMount() {
		this.addRandomComment();
	};

	CommentBox.prototype.render = function render() {
		return React.createElement(
			'div',
			{ className: 'comment-box' },
			React.createElement(
				'h1',
				null,
				'Comments'
			),
			React.createElement(CommentList, { data: this.state.data }),
			React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
		);
	};

	return CommentBox;
}(React.Component);

ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('app'));