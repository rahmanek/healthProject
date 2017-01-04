# Medumo

### Installation
1) Requires Node v6 and NPM
2) Run command `npm install`

### NPM Scripts
* `npm run deploy` Build/compresses all apps at builds/web
* `npm run deploy` -- --buildPath dir1/dir2` Build/compresses all apps at dir1/dir2
* `npm run view` Build all apps at builds/web and opens a webserver
* `npm run register` Runs register app with developer tools
* `npm run welcome` Runs welcome app with developer tools

### Definitions
- `uat` User Access Token
- `tid` Tenant ID

### Routes
- `GET api/ProviderTimeline/:tid` Pull provider timeline with Tenant ID
- `GET: api/TimelineAssociate/:uat`  Pulls a list of timeline associates for a user
- `POST  api/TimelineAssociate/:uat`
	- TimelineID
	- User
	- Role {"user"}

- `PUT api/Notification/:uat`
	- NotificationPreferenceType
	- Enabled
- `GET api/User/:uat` Pulls user information
- `POST api/User` Create user with the following options:
	- SurName
	- GivenName
	- Email
	- PhoneNumber
- `PUT api/User` Update User info
- `POST api/TenantPatientIdentifier/:id`
		- Identifier
- `POST api/PatientTimeline/:uat` Create a patient timeline
	- MilestoneDate
	- ProviderTimelineId

### Pages
- `register?tid=:tid` Register page, comes with a Tenant ID parameter
- `welcome?id=:uat&vid=:vid` Welcome page, comes with User Access Token
