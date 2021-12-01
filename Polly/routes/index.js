var express = require('express');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path');
var router = express.Router();


//Tao client polly
const Polly = new AWS.Polly({
	region: 'us-east-1',
	secretAccessKey: '2COvy0j3HiX8ofJkFHH0Tql+1CrREJIidowVheyA',
	accessKeyId: 'ASIAQLGDQYLX2X3XYJHE',
	sessionToken: 'FwoGZXIvYXdzEEkaDMkli4mpVbdoQecJBSLPARSnQxqsOugHaPxL0H1C4/e1iHbu+agkdw7+B3OAqBC71NFYrg1UHpOAKqg0YWzsHSr+Rsk7/DQT1O14zepY/QbP/BNjwTN4+sgzHzpW5EUG1/0jY4SxB6oaEFqhcgWWOQPd7rplA2uES7GLEdOqLAjSQb7TsugxbCBL5pZ0LxbzasvAfsqpdPOtCJ/9ZyUvNnlFUfnusYstJnqu4jb6ZcIBJXy8OEFiGj2x/+EfhkedIfMjE5Kn2+3KWVNuRSjcmssEPjSIe5i171xHARu5qijjz5yNBjItGNPcMc5LqfvoDgLt8/b0mnRdnoaLAaIojRQMbJ0sO//HBc39KXgL9LdXueLS'
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


