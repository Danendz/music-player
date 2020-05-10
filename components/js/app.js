const myAudio = document.getElementById('myAudio');
const durationAudio = document.getElementById('durationAudio');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const timeAudio = document.getElementById('timeAudio');
const playFa = document.querySelector('.fa-play');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progressBar');
const titleAuthor = document.getElementById('titleAuthor');
const titleName = document.getElementById('titleName');
const titleImg = document.querySelector('.titleImg');
const effect = document.querySelector('.effect');
const volume = document.getElementById('volume');
const mute = document.getElementById('mute');
const buffered = document.getElementById('buffered');
let seeking = false, playState, activeMusic;

const music = [
    {
        author: 'Pascal Letoublon',
        name: 'Friendships',
        src: './components/media/Pascal Letoublon - Friendships.mp3',
        img: './components/img/pascal.jpg'
    },
    {
        author: 'Bones',
        name: 'CrtlAltDelete',
        src: './components/media/Bones - CtrlAltDelete.mp3',
        img: './components/img/bones.jpg'
    },
    {
        author: 'Lida',
        name: 'Карантинейджер',
        src: './components/media/lida-karantinejdzher.mp3',
        img: './components/img/lida.jpg'
    },
    {
        author: 'Lil Nas ft. Billy Ray Cyrus',
        name: 'Old town road',
        src: './components/media/lil-nas-x-ft-billy-ray-cyrus-old-town-road(mp3-top.info).mp3',
        img: './components/img/lil_nas.jpg'
    }
];

const musicInfo = () => {
    myAudio.src = music[activeMusic].src;
    titleImg.src = music[activeMusic].img;
    titleAuthor.textContent = music[activeMusic].author;
    titleName.textContent = music[activeMusic].name;
}

const init = () => {
    playState = 0;
    activeMusic = 0;
    myAudio.currentTime = 0.1;
    timeAudio.textContent = `0:00`;
    musicInfo();
}

init();

const timeMath = (time, dom) => {
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    dom.textContent = `${mins}:${secs}`;
    if (secs < 10) {
        dom.textContent = `${mins}:0${secs}`;
    }
}

const play = (state, remove, add) => {
    playState = state;
    playFa.classList.remove(remove);
    playFa.classList.add(add);
}

const musicCtrl = (playStateValue = 0) => {
    if (playState === playStateValue) {
        play(1, 'fa-play', 'fa-pause');
        myAudio.play();
    } else {
        play(0, 'fa-pause', 'fa-play');
        myAudio.pause();
    }
}

playBtn.addEventListener('click', () => {
    musicCtrl();
});

const nextSong = () => {
    if (activeMusic === music.length - 1) {
        activeMusic = 0;
        musicInfo();
        musicCtrl(1);

    } else {

        activeMusic++;
        musicInfo();
        musicCtrl(1);
    }
}
const previousSong = () => {
    if (activeMusic === 0 || myAudio.currentTime > 2) {
        myAudio.currentTime = 0;
        musicCtrl(1);
    } else {
        activeMusic--;
        musicInfo();
        musicCtrl(1);
    }
}
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            musicCtrl();
            break;
        case 'ArrowRight':
            e.preventDefault();
            myAudio.currentTime += 5;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            myAudio.currentTime -= 5;
            break;
        case 'ArrowUp':
            e.preventDefault();
            nextSong();
            break;
        case 'ArrowDown':
            e.preventDefault();
            previousSong();
            break;
        case 'KeyV' && 'Equal':
            e.preventDefault();
            myAudio.volume >= 0.9 ? myAudio.volume = 1 : myAudio.volume += 0.1;
            break;
        case 'KeyV' && 'Minus':
            e.preventDefault();
            myAudio.volume <= 0.1 ? myAudio.volume = 0 : myAudio.volume -= 0.1;
            break;
    }

});

setInterval(() => {
    if (myAudio.duration > 0) {
        const played = myAudio.currentTime / myAudio.duration * 100;
        const loaded = myAudio.buffered.end(0) / myAudio.duration * 100;
        timeMath(myAudio.currentTime, timeAudio);
        timeMath(myAudio.duration, durationAudio);
        progress.value = played;
        volume.value = myAudio.volume;
        buffered.value = loaded;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: music.name,
            artist: music.author,
            artwork: music.img
        });

        if (myAudio.currentTime === myAudio.duration) {
            nextSong();
        }
        if (myAudio.paused) {
            play(0, 'fa-pause', 'fa-play');
            titleImg.classList.remove('titleImgAnim');
            effect.style.width = '0px'
            effect.style.height = '0px'
        } else {
            play(1, 'fa-play', 'fa-pause');
            titleImg.classList.add('titleImgAnim');
            effect.style.width = '10px'
            effect.style.height = '10px'
        }
        if (myAudio.volume === 0) {
            mute.classList.remove('fa-volume-up', 'mr-3', 'fa-volume-down');
            mute.classList.add('fa-volume-off', 'mr-4');

        } else if (myAudio.volume <= 0.5 && myAudio.volume > 0) {
            mute.classList.remove('fa-volume-up', 'mr-3', 'fa-volume-off');
            mute.classList.add('fa-volume-down', 'mr-4');

        } else {
            mute.classList.remove('fa-volume-down', 'mr-4', 'fa-volume-off');
            mute.classList.add('fa-volume-up', 'mr-3');

        }

    }
}, 30);


///controls for pc
buffered.addEventListener("mousedown", function (e) { seeking = true; seekPc(e); });

buffered.addEventListener("mousemove", function (e) { seekPc(e); });

buffered.addEventListener("mouseup", function () { seeking = false; });

function seekPc(e) {
    if (seeking) {
        let x = e.clientX - buffered.offsetLeft,
            clickedValue = x * buffered.max * myAudio.duration / 100 / buffered.offsetWidth;
        myAudio.currentTime = clickedValue;
    }
}

///controls for mobile
buffered.addEventListener("touchstart", function (e) { seeking = true; seekMob(e); });

buffered.addEventListener("touchmove", function (e) { seekMob(e); });

buffered.addEventListener("touchend", function () { seeking = false; });

function seekMob(e) {
    if (seeking) {
        let x = e.changedTouches[0].clientX - buffered.offsetLeft,
            clickedValue = x * buffered.max * myAudio.duration / 100 / buffered.offsetWidth;
        myAudio.currentTime = clickedValue;
    }
}

nextBtn.addEventListener('click', () => {
    nextSong();
});

backBtn.addEventListener('click', () => {
    previousSong();
});

volume.addEventListener("click", function (e) {
    let x = e.clientX - volume.offsetLeft,
        clickedValue = x * volume.max / volume.offsetWidth;
    myAudio.volume = clickedValue;
});

mute.addEventListener('click', () => {
    myAudio.volume > 0 ? (mute.classList.remove('fa-volume-up', 'mr-3'), mute.classList.add('fa-volume-off', 'mr-4'), myAudio.volume = 0) : (myAudio.muted = false, mute.classList.remove('fa-volume-off', 'mr-4'), mute.classList.add('fa-volume-up', 'mr-3'), myAudio.volume = 1);
});

