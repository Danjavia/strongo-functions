const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp(functions.config().firebase);

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const apiKey = functions.config().epayco.public_key;
const privateKey = functions.config().epayco.private_key;

const epayco = require('epayco-node')({
	apiKey: apiKey,
	privateKey: privateKey,
	lang: 'ES',
	test: true
});

exports.sendSMS = functions.firestore
	.document('leads/{userId}')
	.onUpdate((change, context) => {

		const newValue = change.after.data();

		// Send the text message.
		if (newValue['x_code_response'] === 1) {
			client.messages.create({
				to: `+57${newValue.phoneNumber.trim()}`,
				from: '+12523850440',
				body: `Bienvenid@ a StronGo ${newValue.fullName}, el código para la activación de tu plan es ${newValue.earlyCode}. Espera pronto más información para disfrutar de nuestros servicios. No viajas solo, viajas con tu familia...`,
			});

			client.messages.create({
				to: `+573505764881`,
				from: '+12523850440',
				body: `Felicitaciones, tienes un usuario nuevo, ${newValue.fullName} ha contratdo el plan premium driver. Que esperas? Llámalo ya al +57${newValue.phoneNumber.trim()}`,
			});

			// client.messages.create({
			// 	to: `+573133046949`,
			// 	from: '+12523850440',
			// 	body: `Felicitaciones, tienes un usuario nuevo, ${newValue.fullName} ha contratdo el plan premium driver. Que esperas? Llámalo ya al +57${newValue.phoneNumber.trim()}`,
			// });
			console.log(newValue, 'Se envio el mensaje');
		}

		return { status: 'ok', message: 'Se enviaron los mensajes' };
	});


exports.getPayment = functions.https.onRequest((req, res) => {
	const returnObj = {};
	returnObj['queryStrings'] = req.query;
	returnObj['body'] = req.body;

	console.log(req.body, req.query, 'Query');

	res.send(returnObj);

	// functions.firestore
	// 	.document('leads/{userId}')
	// 	.onCreate((snap, context) => {
	//
	// 		const newValue = snap.data();
	//
	// 		// Send the text message.
	// 		epayco.charge.get("transaction_id")
	// 			.then(function(charge) {
	// 				console.log(charge);
	// 			})
	// 			.catch(function(err) {
	// 				console.log("err: " + err);
	// 			});
	//
	// 		return { status: 'ok' };
	// 	});

});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
