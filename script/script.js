const player = document.querySelector('.player')
const userVolume = JSON.parse(window.localStorage.getItem('user-volume'))


const pausePath = '<path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>'
const playPath = '<path d="M3 22v-20l18 10-18 10z"/>'
// volume
const mutedPath = '<path d="M22 1.269l-18.455 22.731-1.545-1.269 3.841-4.731h-1.827v-10h4.986v6.091l2.014-2.463v-3.628l5.365-2.981 4.076-5.019 1.545 1.269zm-10.986 15.926v.805l8.986 5v-16.873l-8.986 11.068z"/>'
const normalPath = '<path d="M9 18h-7v-12h7v12zm2-12v12l11 6v-24l-11 6z"/>'
const loudPath = '<path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z"/>'
// song info

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
   playAndPause.innerHTML = pausePath

   audioElement.play()
}

function pauseMusic() {
   audioElement.classList.add('paused')
   playAndPause.innerHTML = playPath
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
      volumeBtn.innerHTML = mutedPath
   }
   else if (volume > 0 && volume < .35) {
      audioElement.muted = false
      volumeBtn.innerHTML = normalPath
   }
   else {
      audioElement.muted = false
      volumeBtn.innerHTML = loudPath
   }
}

volumeInput.addEventListener('input', renderVolume)

volumeBtn.addEventListener('click', (e) => {
   audioElement.muted = !audioElement.muted
   audioElement.muted ? volumeBtn.innerHTML = mutedPath : renderVolume()
})

// loop
loopBtn.addEventListener('click', () => {
   audioElement.loop = !audioElement.loop
   loopBtn.classList.toggle('loop-track')
})
