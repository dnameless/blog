'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommentForm = function (_React$Component) {
	_inherits(CommentForm, _React$Component);

	function CommentForm() {
		_classCallCheck(this, CommentForm);

		var _this = _possibleConstructorReturn(this, (CommentForm.__proto__ || Object.getPrototypeOf(CommentForm)).call(this));

		_this.handleAuthorChange = function (e) {
			_this.setState({ author: e.target.value });
		};

		_this.handleTextChange = function (e) {
			_this.setState({ text: e.target.value });
		};

		_this.handleSubmit = function (e) {
			e.preventDefault();
			var author = _this.state.author.trim(),
			    text = _this.state.text.trim(),
			    user = firebase.auth().currentUser;
			if (!text || !author) {
				return;
			}
			_this.props.onCommentSubmit({
				author: user ? user.displayName : author,
				text: text,
				datetime: new Date().toLocaleString('en-US'),
				photoURL: user ? user.photoURL : false,
				userId: user ? user.uid : false
			});
			_this.setState({ text: '' });
		};

		_this.socialSignIn = function (loginMethod) {
			return function () {
				var provider = void 0;
				switch (loginMethod) {
					case "facebook":
						provider = new firebase.auth.FacebookAuthProvider();
						break;
					case "twitter":
						provider = new firebase.auth.TwitterAuthProvider();
						break;
					case "google":
						provider = new firebase.auth.GoogleAuthProvider();
						break;
				}
				if (!provider) {
					console.log("No valid external login method given.");
					return;
				}
				firebase.auth().signInWithPopup(provider).then(function (result) {
					_this.user = result.user;
					_this.setState({ author: _this.user.displayName });
					_this.props.refreshData();
				}).catch(function (error) {
					console.log(error);
				});
			};
		};

		_this.socialSignOut = function () {
			firebase.auth().signOut().then(function () {
				console.log("Logged out successfully");
				_this.props.refreshData();
				_this.user = firebase.auth().currentUser;
				_this.setState({ author: '' });
			}).catch(function (error) {
				return console.log(error);
			});
		};

		_this.state = { author: '', text: '' };
		return _this;
	}

	_createClass(CommentForm, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.user = firebase.auth().currentUser;
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'form',
					{ className: 'comment-form', onSubmit: this.handleSubmit },
					React.createElement(
						'div',
						{ className: 'social-login' },
						React.createElement('input', {
							type: 'text',
							placeholder: 'Name',
							value: firebase.auth().currentUser ? firebase.auth().currentUser.displayName : this.state.author,
							onChange: this.handleAuthorChange,
							maxLength: '20',
							className: 'name-input',
							required: true
						}),
						firebase.auth().currentUser ? React.createElement(
							'div',
							{ className: 'signout', onClick: this.socialSignOut },
							'Sign out'
						) : React.createElement(
							'div',
							null,
							React.createElement(
								'span',
								null,
								'Or Sign in With'
							),
							React.createElement(
								'a',
								{ onClick: this.socialSignIn('twitter'), className: 'icon-button twitter' },
								React.createElement('i', { className: 'fa fa-twitter' }),
								React.createElement('span', null)
							),
							React.createElement(
								'a',
								{ onClick: this.socialSignIn('facebook'), className: 'icon-button facebook' },
								React.createElement('i', { className: 'fa fa-facebook' }),
								React.createElement('span', null)
							),
							React.createElement(
								'a',
								{ onClick: this.socialSignIn('google'), className: 'icon-button google-plus' },
								React.createElement('i', { className: 'fa fa-google' }),
								React.createElement('span', null)
							)
						)
					),
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
				)
			);
		}
	}]);

	return CommentForm;
}(React.Component);

exports.default = CommentForm;