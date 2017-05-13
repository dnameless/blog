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
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, CommentList);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommentList.__proto__ || Object.getPrototypeOf(CommentList)).call.apply(_ref, [this].concat(args))), _this), _this.deleteComment = function (i) {
			return function (e) {
				var data = Object.assign({}, _this.state.data);
				data.splice(i, 1);
				_this.setState({ data: data });
			};
		}, _temp), _possibleConstructorReturn(_this, _ret);
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
								{ className: 'comment-node', key: i, style: style },
								React.createElement(
									'div',
									{ className: 'print-author' },
									comment.author + ' - ' + comment.datetime,
									React.createElement(
										'span',
										{ onClick: _this2.deleteComment(i), className: 'delete-comment' },
										'Delete'
									)
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
			_this3.props.onCommentSubmit({
				author: author,
				text: text,
				datetime: timeStamp()
			});
			_this3.setState({ text: '' });
		};

		_this3.state = { author: '', text: '' };
		return _this3;
	}

	_createClass(CommentForm, [{
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
					disabled: !this.state.author.trim().length || !this.state.text.trim().length
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

		_this4.handleCommentSubmit = function (comment) {
			var newId = _this4.state.data.length + 1;
			var updates = {};
			comment['id'] = newId;
			updates[newId] = comment;
			_this4.setState({ data: _this4.state.data.concat(comment) });
			_this4.commentsRef.update(updates);
		};

		_this4.handleCommentHide = function (comment) {
			var data = Object.assign({}, _this4.state.data);
			data.splice(comment.id, 1);
			_this4.setState({ data: data });
		};

		_this4.listenToFirebaseComments = function () {
			_this4.commentsRef.on('child_added', function (data) {
				var comment = data.val();
				comment !== null && _this4.handleCommentSubmit(comment);
			});
			_this4.commentsRef.on('child_changed', function (data) {
				var comment = data.val();
				comment !== null && _this4.handleCommentHide(comment);
			});
		};

		_this4.state = { data: [] };
		_this4.commentsRef = defaultDatabase.ref('comments/');
		return _this4;
	}

	_createClass(CommentBox, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.listenToFirebaseComments();
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

