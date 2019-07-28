const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp(functions.config().firebase);

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

exports.sendSMS = functions.firestore
	.document('leads/{userId}')
	.onCreate((snap, context) => {

		const newValue = snap.data();

		// Send the text message.
		client.messages.create({
			to: `+57${newValue.phoneNumber.trim()}`,
			from: '+12523850440',
			body: `Bienvenid@ a StronGo ${newValue.fullName}, el código para la activación de tu plan es ${newValue.earlyCode}. Espera pronto más información para disfrutar de nuestros servicios. No viajas solo, viajas con tu familia...`,
		});

		 return { status: 'ok' };
	});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
