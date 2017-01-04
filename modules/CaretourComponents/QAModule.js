import React from 'react'
import { render } from 'react-dom'

export default React.createClass({
	getDefaultProps: function() {
		return {
        	questionInfo: React.PropTypes.object.isRequired,
			submitQuestion: React.PropTypes.func.isRequired
		};
    },

	getInitialState: function() {
		return {
			selectedResponseId: -1
		};
	},

	componentWillReceiveProps: function(nextProps) {
		if (this.props.questionInfo.Order != nextProps.questionInfo.Order) {
			this.setState({selectedResponseId: -1});
		}
	},

	answerSelected: function(responseId) {
		this.setState({selectedResponseId: responseId});
	},

	render: function() {
		var self = this;

		return (
			<div>
				<div>{this.props.questionInfo.QuestionText}</div>
				{
					this.props.questionInfo.Responses.map(function(row, i) {
						return (
							<div key={i} onClick={() => { self.answerSelected(row.TimelineNodeQuestionResponseId) }}>
								<input type="checkbox" checked={row.TimelineNodeQuestionResponseId == self.state.selectedResponseId} />
								<span>{row.ReponseText}</span>
							</div>
						) 
					})
				}
				<button type="button" disabled={this.state.selectedResponseId == -1} onClick={() => { this.props.submitQuestionAnswer(this.props.questionInfo.Order, this.state.selectedResponseId) }}>Send my response</button>
			</div>
		);
	}

});
