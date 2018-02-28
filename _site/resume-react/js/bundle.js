/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ReactMotion = ReactMotion,
    Motion = _ReactMotion.Motion,
    spring = _ReactMotion.spring,
    TransitionMotion = _ReactMotion.TransitionMotion;

var springPreset = {
	wobbly: [120, 11]
};

var CommentList = function (_React$Component) {
	_inherits(CommentList, _React$Component);

	function CommentList() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, CommentList);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommentList.__proto__ || Object.getPrototypeOf(CommentList)).call.apply(_ref, [this].concat(args))), _this), _this.deleteComment = function (index) {
			return function (e) {
				e.preventDefault();
				_this.props.onCommentDelete(index);
				defaultDatabase.ref('comments/' + index + '/').remove();
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
						_this2.props.data.sort(function (a, b) {
							return new Date(a.datetime) - new Date(b.datetime);
						}).map(function (comment, i) {
							var style = _objectWithoutProperties(interp[i + 1], []);

							var user = firebase.auth().currentUser;
							return React.createElement(
								'div',
								{ className: 'comment-node', key: i, style: style },
								comment.photoURL && React.createElement(
									'div',
									{ className: 'photo' },
									React.createElement('img', { src: comment.photoURL })
								),
								comment.userId && user && comment.userId == user.uid && React.createElement(
									'div',
									{ onClick: _this2.deleteComment(comment.id), className: 'delete-comment' },
									'Delete'
								),
								React.createElement(
									'div',
									{ className: 'comment-text' },
									React.createElement(
										'div',
										{ className: 'author' },
										comment.author + ' - ' + comment.datetime
									),
									comment.text
								)
							);
						})
					);
				}
			);
		}
	}]);

	return CommentList;
}(React.Component);

exports.default = CommentList;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CommentList = __webpack_require__(1);

var _CommentList2 = _interopRequireDefault(_CommentList);

var _CommentForm = __webpack_require__(0);

var _CommentForm2 = _interopRequireDefault(_CommentForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommentBox = function (_React$Component) {
	_inherits(CommentBox, _React$Component);

	function CommentBox() {
		_classCallCheck(this, CommentBox);

		var _this = _possibleConstructorReturn(this, (CommentBox.__proto__ || Object.getPrototypeOf(CommentBox)).call(this));

		_this.handleCommentSubmit = function (comment) {
			var newId = Math.floor(Math.random() * 100000) + '-' + (_this.state.data.length + 1);
			var updates = {};
			comment['id'] = newId;
			updates[newId] = comment;
			_this.setState({ data: _this.state.data.concat(comment) });
			_this.commentsRef.update(updates);
		};

		_this.handleCommentDelete = function (index) {
			_this.setState({ data: _this.state.data.filter(function (comment) {
					return comment.id != index;
				}) });
			defaultDatabase.ref('comments/' + index + '/').remove();
		};

		_this.listenToFirebaseComments = function () {
			_this.commentsRef.on('child_added', function (data) {
				var comment = data.val();
				comment !== null && _this.setState({ data: _this.state.data.concat(comment) });
			});
			_this.commentsRef.on('child_removed', function (data) {
				var comment = data.val();
				comment !== null && _this.handleCommentDelete(comment.id);
			});
		};

		_this.refreshData = function () {
			_this.setState(_this.state);
		};

		_this.state = { data: [] };
		_this.commentsRef = defaultDatabase.ref('comments/');
		return _this;
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
				React.createElement(_CommentList2.default, { data: this.state.data, onCommentDelete: this.handleCommentDelete }),
				React.createElement(_CommentForm2.default, { onCommentSubmit: this.handleCommentSubmit, refreshData: this.refreshData })
			);
		}
	}]);

	return CommentBox;
}(React.Component);

ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('react-app'));

/***/ })
/******/ ]);