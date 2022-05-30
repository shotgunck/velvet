#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')
const input = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

var url = process.argv[2]

if (!url) input.question('Paste your reddit url: ', u => {
    url = u
    download()
    input.close()
})
else download()

function download() {
    console.log('Getting stuff ready...')

    axios.get(url + '.json').then(res => {
        const info = res.data[0].data.children[0].data
        const baseUrl = info.url
        const video_url = baseUrl + '/DASH_720.mp4?source=fallback'
        const audio_url = baseUrl + '/DASH_audio.mp4?source=fallback'
        const final_url = 'https://sd.redditsave.com/download.php?permalink=' + url + '/&video_url=' + video_url + '&audio_url=' + audio_url
    
        axios.get(final_url, { responseType: 'stream' }).then(async video => {
            const title = info.title + '.mp4'
            const file = fs.createWriteStream(title)

            console.log('Saving to ' + title)

            await video.data.pipe(file)

            console.log('Done!')
        }).catch(e => console.error('An unknown error occured, possibly invalid URL'))
    }).catch(e => console.error('Invalid URL'))
}
