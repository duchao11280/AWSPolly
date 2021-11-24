var express = require('express');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path');
var router = express.Router();

AWS.config.getCredentials(function(err) {
	if (err) console.log(err.stack);
	// credentials not loaded
	else {
	  console.log("Access key:", AWS.config.credentials.region);
	  console.log("Access key:", AWS.config.credentials.secretAccessKey);
	  console.log("Access key:", AWS.config.credentials.accessKeyId);
	  console.log("Access key:", AWS.config.credentials.sessionToken);
	}
});
//Tao client polly
const Polly = new AWS.Polly({
  region: AWS.config.credentials.region,
  secretAccessKey: AWS.config.credentials.secretAccessKey,
  accessKeyId: AWS.config.credentials.accessKeyId, 
  sessionToken: AWS.config.credentials.sessionToken
})

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');

});
router.get('/voice/:fileName', function(req, res){
	res.sendFile(path.join(__dirname, '../voice', req.params.fileName))
})
router.post("/convert", function (req, res) {
	var data = {
		Text: req.body.Text,
		OutputFormat: "mp3",
		VoiceId: req.body.VoiceId,
		LanguageCode: req.body.LanguageCode
	}
	Polly.synthesizeSpeech(data, (err, data) => {
		if (err) {
			res.json({message: "Chuyển đổi thất bại."})
			return;
		}
		if (data.AudioStream instanceof Buffer) {
			var date = new Date();
			fileName = date.getTime().toString();
			fs.writeFile(`../Polly/voice/${fileName}.mp3`, data.AudioStream, (fsErr) => {
				if (fsErr) {
					res.status(500).send(fsErr);
					return;
				}
				else{
					res.json({urlVoice:`${fileName}.mp3`})

				}
			})
		}
	})
})


module.exports = router;


