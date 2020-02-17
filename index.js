require('dotenv').config();
var readline = require('readline');
var authy = require('authy');

const APIKEY = process.env.APIKEY; // Your Production API Key from https://www.twilio.com/console/authy/applications/
const client = authy(APIKEY); //Authy API client to get authenticated

//Create object to read the user's input
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Function to create the Authy user
var createAuthyUser = function (){
	rl.question("What's your email? ", (email) => {
		rl.question("What's your phone number? ", (phoneNumber) => {
			rl.question("What's your country code? ", (countryCode) => {
				client.register_user(email, phoneNumber, countryCode, function (err, res) { 
				//Without the country code, Authy sets the account in the US
					if (err) {
						console.error(err);
						rl.close();
						return;
					}
					console.log(res.user.id);
					sendOTP(res.user.id);
				});
			
			});
		});
	});
}

//Function to send the OTP
var sendOTP = function (authyId){
	client.request_sms(authyId, function (err, res) {
		if (err){
			console.error(err);
			rl.close();
			return;
		}
		console.log(res.message);
		verifyOTP(authyId);
	});
}

//Function to verify the OTP
var verifyOTP = function (authyId){
	rl.question("Insert the token you received: ", (token) => {
		client.verify(authyId, token, function (err, res) {
			if (err){
				console.error(err);
				rl.close();
				return;
			}
		  console.log(res.message);
		  rl.close();
		});
	})
	
}

createAuthyUser();