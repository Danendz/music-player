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
const volume = document.getElementById('volume');
const mute = document.getElementById('mute');
const buffered = document.getElementById('buffered');
const musicCollectionBtn = document.querySelector('.controls-container__title-image');
const musicCollection = document.querySelector('.music-collection');

let seeking = false, playState, activeMusic;

///Pseudo database
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

///Music live info
const musicInfo = () => {
    myAudio.src = music[activeMusic].src;
    titleImg.src = music[activeMusic].img;
    titleAuthor.textContent = music[activeMusic].author;
    titleName.textContent = music[activeMusic].name;
}

///Initialization function
const init = () => {
    playState = 0;
    activeMusic = 0;
    myAudio.currentTime = 0.1;
    timeAudio.textContent = `0:00`;
    musicInfo();
}

///Initialization
init();

///Seconds to minutes and seconds
const timeMath = (time, dom) => {
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    dom.textContent = `${mins}:${secs}`;
    if (secs < 10) {
        dom.textContent = `${mins}:0${secs}`;
    }
}

///Play function
const play = (state, remove, add) => {
    playState = state;
    playFa.classList.remove(remove);
    playFa.classList.add(add);
}

///Music control play or pause function
const musicCtrl = (playStateValue = 0) => {
    if (playState === playStateValue) {
        play(1, 'fa-play', 'fa-pause');
        myAudio.play();
    } else {
        play(0, 'fa-pause', 'fa-play');
        myAudio.pause();
    }
}

///Play button
playBtn.addEventListener('click', () => {
    musicCtrl();
});

///Next song function
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

//Previous song function
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

///Control from keybord
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

///The live update for music(maybe it was not a good idea to do this)
setInterval(() => {
    if (myAudio.duration > 0) {
        const played = myAudio.currentTime / myAudio.duration * 100;
        const loaded = myAudio.buffered.end(0) / myAudio.duration * 100;
        timeMath(myAudio.currentTime, timeAudio);
        timeMath(myAudio.duration, durationAudio);
        progress.value = played;
        volume.value = myAudio.volume;
        buffered.value = loaded;
        if (myAudio.currentTime === myAudio.duration) {
            nextSong();
        }
        if (myAudio.paused) {
            play(0, 'fa-pause', 'fa-play');
            titleImg.classList.remove('titleImgAnim');
        } else {
            play(1, 'fa-play', 'fa-pause');
            titleImg.classList.add('titleImgAnim');
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
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: music[activeMusic].name,
                artist: music[activeMusic].author,
                artwork: [
                    { src: music[activeMusic].img }
                ]
            });

            navigator.mediaSession.setActionHandler('seekbackward', function () {
                myAudio.currentTime -= 5;
            });
            navigator.mediaSession.setActionHandler('seekforward', function () {
                myAudio.currentTime += 5;
            });
            navigator.mediaSession.setActionHandler('previoustrack', function () {
                previousSong();
            });
            navigator.mediaSession.setActionHandler('nexttrack', function () {
                nextSong();
            });
            navigator.mediaSession.setActionHandler('seekto', function (event) {
                if (event.fastSeek && ('fastSeek' in audio)) {
                    audio.fastSeek(event.seekTime);
                    return;
                }
                myAudio.currentTime = event.seekTime;
            });
        }
    }
}, 30);

///Controls for pc
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

///Controls for mobile
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

///Next song button
nextBtn.addEventListener('click', () => {
    nextSong();
});

///Previous song button
backBtn.addEventListener('click', () => {
    previousSong();
});

///volume changer
volume.addEventListener("click", function (e) {
    let x = e.clientX - volume.offsetLeft,
        clickedValue = x * volume.max / volume.offsetWidth;
    myAudio.volume = clickedValue;
});

///Mute music on click to volume icon
mute.addEventListener('click', () => {
    myAudio.volume > 0 ? (mute.classList.remove('fa-volume-up', 'mr-3'), mute.classList.add('fa-volume-off', 'mr-4'), myAudio.volume = 0) : (myAudio.muted = false, mute.classList.remove('fa-volume-off', 'mr-4'), mute.classList.add('fa-volume-up', 'mr-3'), myAudio.volume = 1);
});

///Playlist open and close
musicCollectionBtn.addEventListener('click', () => {
    musicCollection.style.height === '50vh' ? musicCollection.style.height = '0vh' : musicCollection.style.height = '50vh';
});

///loop for playlist
for (i = 0; i < music.length; i++) {

    ///Create playlist elements
    const container = document.createElement('div');
    const divTitle = document.createElement('div');
    const divAditional = document.createElement('div');
    const likeIcon = document.createElement('i');
    const img = document.createElement('img');
    const author = document.createElement('span');
    const name = document.createElement('span');

    ///Added classes
    container.classList.add('d-flex', 'music-collection__container', 'pt-3', 'pb-3');
    divTitle.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100', 'titleContainer');
    divAditional.classList.add('d-flex', 'flex-row', 'w-100', 'additional');
    img.classList.add('titleImgCollection', 'ml-3');
    author.classList.add('pt-3', 'pb-1');
    likeIcon.classList.add('fa', 'likeIcon', 'mt-4', 'fa-heart-o');

    ///Added ids
    author.id = 'titleAuthor';
    name.id = 'titleName';

    ///Database value in the elements
    img.src = music[i].img;
    author.innerHTML = music[i].author;
    name.innerHTML = music[i].name;

    ///Added elements into html
    container.appendChild(img);
    container.appendChild(divTitle);
    divTitle.appendChild(author);
    divTitle.appendChild(name);
    container.appendChild(divAditional);
    divAditional.appendChild(likeIcon);
    musicCollection.appendChild(container);
}

const musicCollectionContainer = document.querySelectorAll('.music-collection__container');
const like = document.querySelectorAll('.likeIcon');
const titleContainer = document.querySelectorAll('.titleContainer');
const titleImgCollection = document.querySelectorAll('.titleImgCollection');

///Change music on click from playlist
musicCollectionContainer.forEach((el, id) => {
    const changeMusic = () => {
        activeMusic = id;
        musicInfo();
        musicCtrl(1);
    }

    titleContainer[id].addEventListener('click', changeMusic);
    titleImgCollection[id].addEventListener('click', changeMusic);

    like[id].addEventListener('click', () => {
        if (like[id].className === 'fa likeIcon mt-4 fa-heart-o') {
            like[id].classList.remove('fa-heart-o');
            like[id].classList.add('fa-heart');
        } else {
            like[id].classList.remove('fa-heart');
            like[id].classList.add('fa-heart-o');
        }
    });
});