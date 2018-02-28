'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CommentList = require('./components/CommentList');

var _CommentList2 = _interopRequireDefault(_CommentList);

var _CommentForm = require('./components/CommentForm');

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