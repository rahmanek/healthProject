import React from 'react'
import { render } from 'react-dom'
import { getQueryVariable } from '../Utilities.js'
import Footer from './footer.js'
import QAModule from './QAModule';

export default React.createClass({
	getInitialState: function() {
		return {
			instructions: {},
			contentInfo: null,
			questionIndex: 0
		}
	},
	componentDidMount: function() {
		var nodeId = this.props.location.query.id;
		$.get("/api/v1/patient/timeline/node/" + nodeId, (data) => {
			this.setState({contentInfo: data});
		}).fail((err) => {
			console.log(err);
			return;
		});
	},

	submitQuestionAnswer: function(questionOrderId, selectedResponseId) {
		var newQuestionInfo = Object.assign({}, this.state.contentInfo);
		newQuestionInfo.Content.NodeQuestionCollection.Questions.map(function(question) {
			if (question.Order == questionOrderId) {
				question.Responses.map(function(response) {
					if (response.TimelineNodeQuestionResponseId == selectedResponseId) {
						response.Selected = true;
					} else {
						response.Selected = false;
					}
				})
			}
		});

		if (this.state.questionIndex >= (this.state.contentInfo.Content.NodeQuestionCollection.Questions.length - 1)) {
			var nodeId = this.props.location.query.id;
			var self = this;

			$.post("/api/v1/patient/timeline/node/" + nodeId, newQuestionInfo.Content, function() {
				self.props.history.push('/endmodule?id=' + nodeId);
			}).fail((err) => {
				console.log(err);
				return;
			});
		} else {
			this.setState({questionIndex: this.state.questionIndex + 1, contentInfo: newQuestionInfo});
		}
	},

	render: function() {
		if (this.state.contentInfo == null) {
			return (
				<div className ="text-center paddingTop50">
					<span><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i><span className="sr-only">Loading...</span></span>
				</div>
			);
		}

		if (this.state.contentInfo.Content.ContentType == 0) {
			var nodeWrapper = "node-wrapper";
			var rotateMessage = "rotate-message";
			console.log(navigator.userAgent);
			if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
				var nodeWrapper = "";
				var rotateMessage = "";
			}
			return (
				<div className="fullHeight">
					<div id={nodeWrapper} className="fullHeight">
						<iframe id="caretour" src={this.state.contentInfo.Content.DataUrl}>
							<p>Your browser does not support iframes.</p>
						</iframe>
					</div>
					<div id={rotateMessage}>
						<p>Please rotate your phone screen. </p>
					</div>
				</div>
			);
		}

		if (this.state.contentInfo.Content.ContentType == 4) {
			if (this.state.contentInfo.Content.NodeQuestionCollection.Questions.length > this.state.questionIndex) {
				var currentQuestion = this.state.contentInfo.Content.NodeQuestionCollection.Questions[this.state.questionIndex];
				var questionsToGo = this.state.contentInfo.Content.NodeQuestionCollection.Questions.length - (this.state.questionIndex + 1);

				return (
					<div className="fullHeight">
						<div>{questionsToGo} questions to go!</div>
						<QAModule questionInfo={currentQuestion} submitQuestionAnswer={this.submitQuestionAnswer} />
					</div>
				);
			} else {
				return (
					<div className="fullHeight">
						<div>Thank you for updating your care team!</div>
						<div>{this.state.contentInfo.Content.FinalNotes}</div>
					</div>
				);
			}
		}
	}

});
