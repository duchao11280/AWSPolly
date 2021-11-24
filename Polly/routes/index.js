var express = require('express');
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path');
var router = express.Router();


//Tao client polly
const Polly = new AWS.Polly({
  region: 'us-east-1',
  secretAccessKey: '4996rxZWt5krkmVfeOWF37VuA7m1G+COT8rWGFdB',
  accessKeyId: 'ASIAV5BA3TBHKJIJ7YH2', 
  sessionToken: 'FwoGZXIvYXdzEBQaDHdGloo8M0Jtam7uVCLPAZrt4iA0ybv9W3IgjBx7T6MptLTJwBgFNI/tb/n6BfN4Hd2cloqxHqFfVDl9C1fM9jsvv79pVSksT7tan/W+lwm9adUgF6Iixu3UeJT47bQ1K4tZF2f8ni3z4Krvx+41VWryJn3hZRQXVY7gsU8quuEhtKlEDB16fTxRdp149BKPIcZDa/u8ORUcRKp/QwWqiJlRy+KaJnVgOVIdUzeixuBLfmAkgvNpxUqk2MuNUKNkGeWYo6imvTnucoAhBtSkXHVW17VpnF6WroZTsvRQwCjZ2NiMBjItGGUeGCs1SrWwyUCUEulK7NiUp8DLhV5Ix4WfMQwSu4rQf1X9132jK+AWiDkT'
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


