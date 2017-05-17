'use strict';

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