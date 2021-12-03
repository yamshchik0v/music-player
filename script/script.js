const player = document.querySelector('.player')
// const trackListElem = document.getElementById('.player-list')
// const openListElem = document.getElementById('.open-list')
const userVolume = JSON.parse(window.localStorage.getItem('user-volume'))
// song info

const title = document.getElementById('pTitle')
const songCover = document.getElementById('player-cover')
const songName = document.getElementById('name')
const songArtist = document.getElementById('artist')

// audio controls
const audioElement = document.getElementById('audio')
const loopBtn = document.getElementById('loop')
const playAndPause = document.getElementById('play')
const nextBtn = document.getElementById('fwd')
const prevBtn = document.getElementById('bwd')

const volumeBtn = document.getElementById('vol')
const volumeBlock = document.querySelector('.volume-block')
const volumeInput = document.getElementById('volume-input')
const volumeValue = document.getElementById('volume-value')

const progressBlock = document.getElementById('progress-block')
const progressBar = document.getElementById('progress-bar')

// ===============================

let songIndex = 0;

window.addEventListener("load", () => {
   loadSong(songIndex)
   if (window.localStorage.getItem(userVolume)) audioElement.volume = userVolume
   console.log(audioElement.volume)
   volumeInput.value = userVolume * 100
   renderVolume()
})

// function that load music
function loadSong(index) {
   progressBar.style.width = `${0}%`
   songName.innerText = music[index].name
   songArtist.innerText = music[index].artist
   marqueeString(songName)
   marqueeString(songArtist)
   songCover.src = `img/${music[index].cover}.jpg`
   audioElement.src = `audio/${music[index].src}.mp3`
}


// is autor or songname overflowed
function isOverflowed(el) {
   return el.scrollWidth > el.offsetWidth;
}

function marqueeString(textElem) {
   isOverflowed(textElem) ?
      textElem.classList.add('marquee-class') :
      textElem.classList.remove('marquee-class')
}

// function that check is music playing atm
function isPlaying() {
   return !audioElement.classList.contains('paused')
}

// play / pause 

function playMusic() {
   audioElement.classList.remove('paused')
   title.innerText = 'Playing Now'
   playAndPause.classList.remove('fa-play')
   playAndPause.classList.add('fa-pause')
   audioElement.play()
}

function pauseMusic() {
   audioElement.classList.add('paused')
   title.innerText = 'Paused'
   playAndPause.classList.remove('fa-pause')
   playAndPause.classList.add('fa-play')
   audioElement.pause()
}

// previous / next 

function nextSong() {
   songIndex >= (music.length - 1) ? songIndex = 0 : songIndex++
   loadSong(songIndex)
   if (isPlaying()) playMusic()

}

function prevSong() {
   if (audioElement.currentTime > 5) {
      audioElement.currentTime = 0
      return
   }

   songIndex <= 0 ? songIndex = (music.length - 1) : songIndex--
   console.log(songIndex)

   loadSong(songIndex)

   if (isPlaying()) playMusic()
}

// event on buttons 
// 1. play / pause
// 2. next song
// 3. previous song 

playAndPause.addEventListener('click', () => {
   isPlaying() ? pauseMusic() : playMusic()
})

nextBtn.addEventListener('click', () => {
   nextSong()
})

prevBtn.addEventListener('click', () => {
   prevSong()
})

// progress bar events 
progressBlock.addEventListener('click', (e) => {
   const progressBarWidth = progressBlock.clientWidth
   const clickOffset = e.offsetX
   audioElement.currentTime = (clickOffset / progressBarWidth) * audioElement.duration
})

const audioDurationElem = document.getElementById('audio-duration')
const audioATMElem = document.getElementById('audio-atm')


audioElement.addEventListener('timeupdate', (e) => {

   const currentTime = e.target.currentTime // current time of song
   const duration = e.target.duration // song duration
   if (currentTime === duration) nextSong()
   let progressWidth = (currentTime / duration) * 100
   progressBar.style.width = `${progressWidth}%`


   let minATM = Math.floor(currentTime / 60)
   let secATM = Math.floor(currentTime % 60)
   if (minATM < 10) minATM = `0${minATM}`;
   if (secATM < 10) secATM = `0${secATM}`;
   if (secATM === 60) secATM = `00`;
   audioATMElem.innerText = `${minATM}:${secATM}`

   audioElement.addEventListener("loadeddata", () => {

      // show song duration under progress bar
      const songDuration = audioElement.duration

      let min = Math.floor(songDuration / 60)
      let sec = Math.floor(songDuration % 60)
      if (min < 10) min = `0${min}`;
      if (sec < 10) sec = `0${sec}`;
      if (sec === 60) sec = `00`;
      audioDurationElem.innerText = `${min}:${sec}`

   })
   // show time at this moment 


})

// volume controls
function setVolume() {
   return audioElement.volume = volumeInput.value / 100
}
function renderVolume() {
   let volume = setVolume()
   volumeValue.innerText = `${Math.round(volume * 100)}%`
   window.localStorage.setItem('user-volume', volume)


   if (!volume) {
      audioElement.muted = true
      volumeBtn.classList.add('fa-volume-mute')
   }
   else if (volume > 0 && volume < .15) {
      audioElement.muted = false
      volumeBtn.classList.remove('fa-volume-mute')
      volumeBtn.classList.add('fa-volume-down')
   }
   else {
      audioElement.muted = false
      volumeBtn.classList.remove('fa-volume-down')
      volumeBtn.classList.remove('fa-volume-mute')
      volumeBtn.classList.add('fa-volume-up')
   }
}

volumeInput.addEventListener('input', renderVolume)

volumeBtn.addEventListener('click', (e) => {
   audioElement.muted = !audioElement.muted
   volumeBtn.classList.toggle('fa-volume-mute')
})

// loop
loopBtn.addEventListener('click', () => {
   audioElement.loop ? loopBtn.title = "loop current track" : loopBtn.title = "track looped"
   audioElement.loop = !audioElement.loop
   loopBtn.classList.toggle('loop-track')
})

// track list functionality

openListElem.addEventListener('click', () => {
   trackListElem.classList.toggle('opened')
})

