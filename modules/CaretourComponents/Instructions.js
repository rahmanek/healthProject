import React from 'react'
import { render } from 'react-dom'
import { getQueryVariable } from '../Utilities.js'
import Footer from './footer.js'

export default React.createClass({
	getInitialState: function() {
		return {
			instructions: {},
			content: (
				<div className ="text-center marginTop75">
					<span><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i><span className="sr-only">Loading...</span></span>
				</div>
			)
		}
	},
	componentDidMount: function() {
		this.retrieveView(this.props.timeline);
			},
	componentWillReceiveProps:function(newProps){
		this.retrieveView(newProps.timeline);
	},
	retrieveView: function(timeline){

		// If the timeline hasn't been pulled yet;
		if (timeline.Nodes.length == 0) return;

		// Get today's instruction
		var today = new Date();
		var todayInstruction = false;
		for(var i = 0; i < timeline.Nodes.length; i++){
			var node = timeline.Nodes[i];
			var nodeDate = new Date(Date.parse(node.NodeMilestoneDate));
			var formattedTodayDate = (today.getMonth() + 1) + "/" + (today.getUTCDate());
			var formattedNodeDate = (nodeDate.getMonth() + 1) + "/" + (nodeDate.getUTCDate());
			if (formattedTodayDate == formattedNodeDate){
				todayInstruction = true;
				$.post("/api/v1/patient/timeline/node/" + node.AccessTokenValue, (data) => {
					this.setState({content:(
						<div className="fullHeight" >
							<iframe id="caretour" src={data.Content.DataUrl}>
								<p>Your browser does not support iframes.</p>
							</iframe>
							<div className="footerBlock">
							</div>
						</div>
					)});
					return;
				}).fail((err) => {
					console.log(err);
					return;
				});
				break;
			}
		}
		if (!todayInstruction) {
			this.setState({content:(
				<div className = "text-center marginTop75">
					<span>There are no instructions for today</span>
				</div>
			)});
		}
		return;
	},

	render: function() {
		return this.state.content;
	}

});
