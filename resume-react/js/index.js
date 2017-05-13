'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ReactMotion = ReactMotion,
    Motion = _ReactMotion.Motion,
    spring = _ReactMotion.spring,
    TransitionMotion = _ReactMotion.TransitionMotion;

// Helpers

var springPreset = {
	wobbly: [120, 11]
};

var timeStamp = function timeStamp() {
	var options = {
		month: '2-digit',
		day: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	};
	var now = new Date().toLocaleString('en-US', options);
	return now;
};

// Components

var CommentList = function (_React$Component) {
	_inherits(CommentList, _React$Component);

	function CommentList() {
		_classCallCheck(this, CommentList);

		return _possibleConstructorReturn(this, (CommentList.__proto__ || Object.getPrototypeOf(CommentList)).apply(this, arguments));
	}

	_createClass(CommentList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.comDisplay = $('.comment-list');
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var comHeight = this.comDisplay.outerHeight();
			var comScroll = this.comDisplay[0].scrollHeight;
			this.comDisplay.stop().animate({ 'scrollTop': comScroll - comHeight }, 200);
		}
	}, {
		key: 'getStyles',
		value: function getStyles() {
			var configs = {};
			this.props.data.forEach(function (val, index) {
				configs[val.id] = {
					opacity: spring(1),
					top: spring(0, springPreset.wobbly)
				};
			});
			return configs;
		}
	}, {
		key: 'willEnter',
		value: function willEnter(key) {
			return {
				opacity: spring(0),
				top: spring(100, springPreset.wobbly)
			};
		}
	}, {
		key: 'render',
		value: function render() {
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
								{ className: 'comment-node', key: comment.id, style: style },
								React.createElement(
									'div',
									{ className: 'print-author' },
									comment.author + ' - ' + comment.datetime
								),
								comment.text
							);
						})
					);
				}
			);
		}
	}]);

	return CommentList;
}(React.Component);

var CommentForm = function (_React$Component2) {
	_inherits(CommentForm, _React$Component2);

	function CommentForm() {
		_classCallCheck(this, CommentForm);

		var _this3 = _possibleConstructorReturn(this, (CommentForm.__proto__ || Object.getPrototypeOf(CommentForm)).call(this));

		_this3.state = { author: '', text: '', canPost: 'disabled' };
		return _this3;
	}

	_createClass(CommentForm, [{
		key: 'handleAuthorChange',
		value: function handleAuthorChange(e) {
			this.setState({ author: e.target.value });
		}
	}, {
		key: 'handleTextChange',
		value: function handleTextChange(e) {
			this.setState({ text: e.target.value });
		}
	}, {
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();
			var author = this.state.author.trim(),
			    text = this.state.text.trim();
			if (!text || !author) {
				return;
			}
			this.props.onCommentSubmit({
				author: author,
				text: text,
				datetime: timeStamp()
			});
			this.setState({ text: '' });
		}
	}, {
		key: 'render',
		value: function render() {
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
		}
	}]);

	return CommentForm;
}(React.Component);

var CommentBox = function (_React$Component3) {
	_inherits(CommentBox, _React$Component3);

	function CommentBox() {
		_classCallCheck(this, CommentBox);

		var _this4 = _possibleConstructorReturn(this, (CommentBox.__proto__ || Object.getPrototypeOf(CommentBox)).call(this));

		_this4.state = { data: [] };
		return _this4;
	}

	_createClass(CommentBox, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.listenToFirebaseComments();
		}
	}, {
		key: 'handleCommentSubmit',
		value: function handleCommentSubmit(comment) {
			comment['id'] = this.state.data.length + 1;
			this.setState({ data: this.state.data.concat(comment) });
			// post firebase comments
		}
	}, {
		key: 'listenToFirebaseComments',
		value: function listenToFirebaseComments() {
			var _this5 = this;

			var commentsRef = defaultDatabase.ref('comments/');
			defaultDatabase.on('value', function (snapshot) {
				var commentsList = snapshot.val();
				console.log(commentsList);
				_this5.state = { data: commentsList };
			});
		}
	}, {
		key: 'render',
		value: function render() {
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
		}
	}]);

	return CommentBox;
}(React.Component);

ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('react-app'));

