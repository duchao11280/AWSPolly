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
	secretAccessKey: 'UjQT2N9W8dayxllo+R9a9plu5o9ArRTN9aKXoa8/',
	accessKeyId: 'ASIAQLGDQYLX2O7BDSJ2',
	sessionToken: 'FwoGZXIvYXdzEIL//////////wEaDJhqWoeTzlS/nGbWzCLPAV43G/Yyo6IKlcBTWowHtJSZdf9NefVj4TojZgLlCpGdMeXMuYWOSNh9j4BajA/HpsXdipGu7uqeiHx49mbHbYBpKfuwkAsS3wIKE44ajy20c86w/6hDs2Eh1bBrodrq91zRIZZER9vVz+MKEm7aZ+u3ba1J8KRPkBtcJ+4+FNrW09TDMr0x+gkwhbevTStpczjaUGgp6OSvdOK4HybTnSpmivloN68rV6oFDNAGo5LWUvJm7zUkrHUZHRWePINSElzktKs/FLF+3nRhqRaVUSi7teGNBjItj9dwcd6gqJuB/z9YUIhlg1cNInzgOzfEJXSxJze26R1IN/5wVb6wi04QiHjk'
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
		.then((response)=>{
			const dom = new JSDOM(response.data)
			const title = dom.window.document.title
			const pHTML = dom.window.document.querySelectorAll('p')
			var content = '';
			for(var i = 0; i < pHTML.length; i++){
				if(pHTML[i].textContent !== undefined){
					content = content + ' ' + pHTML[i].textContent;
				}
				
			}
			let text = title + " " + content;
			console.log(text.length)
			var data= {
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
		.catch((err)=>{console.log(err)})
	
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


