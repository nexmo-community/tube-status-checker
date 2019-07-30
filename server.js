const Nexmo = require('nexmo');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const request = require('request');
const dotenv = require('dotenv')
let status = []

dotenv.config();
const lines = ['CENTRAL', 'BAKERLOO', 'DISTRICT', 'VICTORIA', 'NORTHERN', 'CIRCULAR', 'HAMMERSMITH-CITY', 'JUBILEE', 'METROPOLITAN', 'PICCADILLY', 'WATERLOO-CITY']
const nexmo = new Nexmo({
	apiKey: process.env.apiKey,
	apiSecret: process.env.apiSecret
}, { debug: true });

const app_id = process.env.app_id;
const app_key = process.env.app_key;
const NexmoNumber = process.env.Nexmo_LVN;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/inbound', (req, res) => {
	console.log(req.body)
	let Tube_Line = req.body.text.toUpperCase()
	let Number_msisdn = req.body.msisdn

	if ((lines.indexOf(Tube_Line) > -1)) {
		checkLineStatus(Tube_Line, Number_msisdn)
	}
	else {
		sendMessage(Number_msisdn, 'Valid values are ' + lines)
	}
	res.status(204).send()
})



function checkLineStatus(Line, number) {

	var options = {
		json: true,
		url: 'https://api.tfl.gov.uk/Line/' + Line + '/status?app_id=' + app_id + '&app_key=' + app_key,
	}

	request(options, function (err, res, body) {
		if (err) {
			console.log(err)
		}
		else {
			if (body[0].lineStatuses[0].statusSeverityDescription === 'Good Service') {
				console.log('There is a ' + body[0].lineStatuses[0].statusSeverityDescription + ' operating on ' + body[0].name + ' line')
				sendMessage(number, 'There is a ' + body[0].lineStatuses[0].statusSeverityDescription + ' operating on ' + body[0].name + ' line')
			}
			else {
				for (let i = 0; i < body.length; i++) {
					for (let j = 0; j < body[i].lineStatuses.length; j++) {
						status.push(body[i].lineStatuses[j].reason)
					}
				}
				sendMessage(number, status)
				console.log(status)
			}
		}
	})
}


function sendMessage(to, message) {
	nexmo.message.sendSms(process.env.Nexmo_LVN, to, message,
		(err, responseData) => {
			if (err) {
				console.log(err);
			} else {
				console.dir(responseData.messages);
			}
		})
}


app.listen(port, () => { console.log('App listening in port ', port) })
