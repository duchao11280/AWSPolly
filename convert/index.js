const AWS = require('aws-sdk')
const fs = require('fs')

const Polly = new AWS.Polly({
    region: 'us-east-1',
    secretAccessKey: 'o495i0hu2uB+aIAZOpniNPQfrlOROKMTCDqGccdg',
    accessKeyId: 'ASIAV5BA3TBHKBQM2NGG', 
    sessionToken: 'FwoGZXIvYXdzEGkaDInpuK9X36FYuISYriLPAZ1Q5UffIoJrBjoghd6dO+LKoo2W0JhlQ+S0al2wQoBIB0eZt1nC4Z0TAt5RxO1/b6WQKi+HnKMWZh7CkJLKBp3PWyco8tOXA0YVa2d4B91AZqhckzRuTRgZu1wSENXe1l3LSjyj4EXiUJbnuKpIqz4YgiYhYQ24MKSY4vBkwego20+PSpfHr7m8ZCpvemXFdQ9BVsfFBvzp5ViNf4HoAY3ZJ9SiL7Oz9PDf7ZLMUpIZ4rYUcyjpe+sK14tzA5+uvaPmhscs2aEpa/QK7QJBIijYg7OMBjItjH4x6qTAXJ9Xv5A0/mk9mEzTn1Y3EmaS4CpauNoGV6BtoA+CeTgqIfNJJIra'
})

const input = {
	Text: "Hello, my Name is Nguyen Duc Hao, today I talk about Demo Polly example in nodejs. Good bye",
	OutputFormat: "mp3",
	VoiceId: "Justin",
	LanguageCode: "en-US" 
}

Polly.synthesizeSpeech(input, (err, data) => {
	if (err) {
		console.log(err)
		return
	}
	if (data.AudioStream instanceof Buffer) {
        // tạo ra file 
		fs.writeFile('hello.mp3', data.AudioStream, (fsErr) => {
			if (fsErr) {
				console.error(fsErr)
				return
			}
			console.log('Success')
		})
	}
})