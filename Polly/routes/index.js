var express = require('express');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path');
var router = express.Router();
const axios = require('axios')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//Tao client polly
const Polly = new AWS.Polly({
	region: 'us-east-1',
	secretAccessKey: 'W07tHvdeftT+3zxsF8L7uL2hsNWptUHTXf/PBcGm',
	accessKeyId: 'ASIAQLGDQYLXVGI5QEVP',
	sessionToken: 'FwoGZXIvYXdzEIf//////////wEaDI98mlK0s3ZlcPQcsyLPAQCW17VBg8rZkzWJEHvW12kAJNjNAfeZEvpDqdBOmA++1kmtRw44emEv0pc4UWcujaaGmJoBp3LyMltUXx31LFvwnCqRPSaVT3FPvESER0IqrDPtEFl4T4IKR6FyfC9dz/pj30aoqC8B0bo+I7tOkJPEMorbfV5+lQAYck6y/rwu6R7rN7Q2FQ9LUjhAFQEGgToRauOhjEeDsYcS6SO0gAZGu2Y9oQbqq2j+K276sFUL5JQm4uU3DnR+ueqJalPb7wfRO6lYaFDmVrEm3vtejiiyvuKNBjItp2r3/OKuxJFDhXLtgHW+usFrDswaGU3uQrowUPPRDTMQVPDqSqZZI6CEB2S2'
})

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');

});
/* GET page convert URL */
router.get('/url', function (req, res, next) {
	res.render('converturl');
})
// 
router.get('/voice/:fileName', function (req, res) {
	res.sendFile(path.join(__dirname, '../voice', req.params.fileName))
})
router.post("/converturl", function (req, res) {
	axios.get(req.body.urlInput)
		.then((response) => {
			const dom = new JSDOM(response.data)
			const title = dom.window.document.title
			const pHTML = dom.window.document.querySelectorAll('p')
			var content = '';
			for (var i = 0; i < pHTML.length; i++) {
				if (pHTML[i].textContent !== undefined) {
					content = content + ' ' + pHTML[i].textContent;
				}

			}
			let text = title + " " + content;
			console.log(text.length)
			var data = {
				Text: text,
				OutputFormat: "mp3",
				VoiceId: req.body.VoiceId,
				LanguageCode: req.body.LanguageCode
			}
			Polly.synthesizeSpeech(data, (err, data) => {
				if (err) {
					res.status(500).json({ message: "Chuyển đổi thất bại." })
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
		.catch((err) => { console.log(err) })

})
// convert Text
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


