
var config = {
	deploymentTargets: {
		prod:'http://medumo-dev-west.azurewebsites.net/',
		hosted:'http://medumo-dev-west.azurewebsites.net/',
		prev:'http://medumo-dev-west.azurewebsites.net/',
		dev:'http://localhost:14983/',
	},
	apiHost: location.protocol + "//" + window.location.host + "/",
	test: process.env.NODE_ENV,
	webHost: "http://localhost:3000/"
}

console.log(config);

export default config;
