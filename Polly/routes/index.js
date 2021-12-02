var express = require('express');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path');
var router = express.Router();


//Tao client polly
const Polly = new AWS.Polly({
	region: 'us-east-1',
	secretAccessKey: 'IqOkhEsqlMwFVW9k7Fn6TcljROVkUU73rWsBFRTQ',
	accessKeyId: 'ASIAQLGDQYLXY73PLOVU',
	sessionToken: 'FwoGZXIvYXdzEGMaDM4pTC4vNo6P9k16TCLPAYiilhv+kAA6sPWRv5AUzghLtd9FCLqF655MYJaDgadzXEaOEh/5NsRhTHTsrRRjszfKjg8qlw4YQ5JvbrnjPzvmPYG1u5luZZFLNbKXkEIAOCl3iOcWOqPcH2I+S1UU//JC3Qsi/wphlVa42VqtPKJGbZr65IYSNjcxmYxB15TpqEJSpTz5M+jL4cQ1HEFh8UBZZEJzp4CujMH3yGU4+c6ERotioPNQOykDrrr+2XV7WC3HcmoSKpCvNt+aIJPbkDtdbZsWeelGLpcuy0sJ9yiCs6KNBjItXVYi9z7ED36L1sXm/y1r/FMCgOP1RomHGLJmfBAFwvEkBpz3juFLnKQOXa3Z'
})

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');

});
router.get('/voice/:fileName', function (req, res) {
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
			res.json({ message: "Chuyển đổi thất bại." })
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
				else {
					res.json({ urlVoice: `${fileName}.mp3` })

				}
			})
		}
	})
})

module.exports = router;


