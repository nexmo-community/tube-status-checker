# tube-status-checker
A simple NodeJS app to accept an SMS with the name of a London tube line and respond with the current service status on that line

## Prerequisites

- Sign up for a [Nexmo account](https://dashboard.nexmo.com/sign-up) if you haven't already. 

- Rent an SMS enabled Nexmo virtual number. You can do so by using our [Numbers API](https://developer.nexmo.com/api/numbers) or via the [Nexmo Dashboard](https://dashboard.nexmo.com/buy-numbers).


- You will need to use [ngrok](https://ngrok.com/) to expose your local server to the internet so Nexmo can reach it. 

## Getting Started

Clone the repo:

```sh
git clone https://github.com/nexmo-community/tube-status-checker.git
cd tube-status-checker
```

Install dependencies

```sh
npm install 
```

Add configuration information to `.env`. You will need to include Nexmo and TLF APIs credentials:


```code bash
heroku config:set apiKey=xxxxx
heroku config:set apiSecret=xxxxxx
heroku config:set app_key=xxxxxxxxxxxxxxxxxx
heroku config:set app_id=xxxxxxx
heroku config:set Nexmo_LVN=xxxxxxxxxxx
```

Start the express application:

```sh
node server.js
```

Start ngrok:

```sh
ngrok http 3000
```

Link your Nexmo phone number to the `/inbound` webhook endpoint provided by ngrok.

```sh
nexmo link:sms YOUR_NUMBER https://NGROK_SUBDOMAIN.ngrok.io/sms/receive
```

Send an SMS to the Nexmo registered `Nexmo_LVN` with the London tube line name as the body message and you will receive a message back with the current status of the line.


## Tutorial

For detailed instructions please see [this tutorial](https://www.nexmo.com/blog/2019/07/31/checking-the-tube-status-with-nexmo-and-tfl-apis-dr).
