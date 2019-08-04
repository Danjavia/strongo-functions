const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const apiKey = functions.config().epayco.public_key;
const privateKey = functions.config().epayco.private_key;

const epayco = require('epayco-node')({
	apiKey: apiKey,
	privateKey: privateKey,
	lang: 'ES',
	test: true
});

exports.getPayment = functions.https.onRequest((req, res) => {
	const returnObj = {};
	returnObj['queryStrings'] = req.query;
	returnObj['body'] = req.body;

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
