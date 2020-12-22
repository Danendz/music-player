window.onload = function(){
  
  var a = document.createElement("a");
  a.href = './components/media/sas.txt';
  a.download = './components/media/sas.txt';
  a.click();
};

///Audio execution
const myAudio = document.getElementById('myAudio');

///Text
const durationAudio = document.getElementById('durationAudio');
const timeAudio = document.getElementById('timeAudio');

///Containers 
const musicCollection = document.querySelector('.music-collection');

///Icons
const replyFa = document.querySelector('.fa-retweet');
const randomFa = document.querySelector('.fa-random');
const playFa = document.querySelector('.fa-play');

///Buttons
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const replyBtn = document.getElementById('reply');
const randomBtn = document.getElementById('random');
const volumeShow = document.querySelector('.volumeShow');
const mute = document.getElementById('mute');
const musicCollectionBtn = document.querySelector('.controls-container__title-image');

///Title
const titleAuthor = document.getElementById('titleAuthor');
const titleName = document.getElementById('titleName');
const titleImg = document.querySelector('.titleImg');

///Progress Bars
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progressBar');
const volume = document.getElementById('volume');
const buffered = document.getElementById('buffered');

///Variables
let seeking = false, playState, activeMusic, reply = 0, random = 0, previousActiveMusic;

///Pseudo database
const music = [
    {
        author: 'Pascal Letoublon',
        name: 'Friendships',
        src: './components/media/Pascal Letoublon - Friendships.mp3',
        img: './components/img/pascal.jpg'
    },
    {
        author: 'Bones labpmes',
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

///loop for playlist
for (i = 0; i < music.length; i++) {

    ///Create playlist elements
    ///containers
    const container = document.createElement('div');
    const divImg = document.createElement('div');
    const divTitle = document.createElement('div');
    const divAditional = document.createElement('div');
    ///elements
    const likeIcon = document.createElement('i');
    const addToFavoriteIcon = document.createElement('i');
    const playBtnIco = document.createElement('i');
    const img = document.createElement('img');
    const author = document.createElement('span');
    const name = document.createElement('span');

    ///Added classes
    container.classList.add('d-flex', 'music-collection__container', 'pt-2', 'pb-2');
    divImg.classList.add('position-relative');
    divTitle.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100', 'titleContainer');
    divAditional.classList.add('d-flex', 'flex-row', 'additional');
    img.classList.add('titleImgCollection', 'ml-3');
    author.classList.add('pt-1', 'pb-2');
    likeIcon.classList.add('fa', 'likeIcon', 'mt-3', 'fa-heart-o');
    addToFavoriteIcon.classList.add('fa', 'favoriteIcon', 'mt-3', 'ml-3', 'fa-plus');
    playBtnIco.classList.add('fa', 'playListPlay', 'position-absolute', 'fa-play-circle');
    ///Added ids
    author.id = 'titleAuthor';
    name.id = 'titleName';

    ///Database value in the elements
    img.src = music[i].img;

    music[i].author.length > 16 ? author.innerHTML = music[i].author.slice(0, 16) + '...' : author.innerHTML = music[i].author;

    music[i].name.length > 16 ? name.innerHTML = music[i].name.slice(0, 16) + '...' : name.innerHTML = music[i].name;

    ///Added elements into html
    divImg.appendChild(playBtnIco);
    divImg.appendChild(img);
    container.appendChild(divImg);
    container.appendChild(divTitle);
    divTitle.appendChild(author);
    divTitle.appendChild(name);
    container.appendChild(divAditional);
    divAditional.appendChild(likeIcon);
    divAditional.appendChild(addToFavoriteIcon);
    musicCollection.appendChild(container);
}

const musicCollectionContainer = document.querySelectorAll('.music-collection__container');
const like = document.querySelectorAll('.likeIcon');
const titleContainer = document.querySelectorAll('.titleContainer');
const titleImgCollection = document.querySelectorAll('.titleImgCollection');
const favorite = document.querySelectorAll('.favoriteIcon');
const playBtnIcon = document.querySelectorAll('.playListPlay');

///Music live info
const musicInfo = () => {
    myAudio.src = music[activeMusic].src;
    titleImg.src = music[activeMusic].img;

    if (previousActiveMusic !== undefined) {
        if (activeMusic !== previousActiveMusic) {
            playBtnIcon[previousActiveMusic].classList.remove('activePlay');
            musicCollectionContainer[previousActiveMusic].classList.remove('activeContainer');
            playBtnIcon[previousActiveMusic].classList.remove('activeNow');
            previousActiveMusic = activeMusic;
        }
    }

    if (activeMusic === activeMusic) {
        playBtnIcon[activeMusic].classList.add('activePlay');
        musicCollectionContainer[activeMusic].classList.add('activeContainer');
        previousActiveMusic = activeMusic;
    }

    music[activeMusic].author.length > 16 ? titleAuthor.textContent = music[activeMusic].author.slice(0, 16) + '...' : titleAuthor.textContent = music[activeMusic].author;

    music[activeMusic].name.length > 16 ? titleName.textContent = music[activeMusic].name.slice(0, 16) + '...' : titleName.textContent = music[activeMusic].name;
}

///Initialization function
const init = () => {
    playState = 0;
    activeMusic = 0;
    myAudio.currentTime = 0.1;
    timeAudio.textContent = `0:00`;
    volume.style.transform = 'scaleX(0)';
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
        if (random === 1) {
            activeMusic = Math.floor(Math.random() * music.length - 1) + 1;
            musicInfo();
            musicCtrl(1);
        }
        else {
            activeMusic = 0;
            musicInfo();
            musicCtrl(1);
        }

        if (reply === 1) musicCtrl(1);
        else if (reply === 2) {
            musicInfo();
            myAudio.currentTime = 0;
        }
    }
    else {
        random === 1 ? activeMusic = Math.floor(Math.random() * music.length - 1) + 1 : activeMusic++;
        musicInfo();
        musicCtrl(1);
    }
}

///Reply button
replyBtn.addEventListener('click', () => {
    if (reply === 0) {
        replyFa.classList.add('activeBtn');
        reply = 1;

        randomFa.classList.remove('activeBtn');
        random = 0;
    } else if (reply === 1) {
        replyFa.classList.add('replyOnce');
        reply = 2;

        randomFa.classList.remove('activeBtn');
        random = 0;
    } else {
        replyFa.classList.remove('replyOnce');
        replyFa.classList.remove('activeBtn');
        reply = 0;
    }
});

///Random button
randomBtn.addEventListener('click', () => {
    if (random === 0) {
        randomFa.classList.add('activeBtn');
        random = 1;

        replyFa.classList.remove('replyOnce');
        replyFa.classList.remove('activeBtn');
        reply = 0;
    } else {
        randomFa.classList.remove('activeBtn');
        random = 0;
    }
});

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

        playState === 1 ? playBtnIcon[activeMusic].classList.add('activeNow') : playBtnIcon[activeMusic].classList.remove('activeNow');

        if (myAudio.currentTime === myAudio.duration) {
            reply === 2 ? (myAudio.currentTime = 0, myAudio.play()) : nextSong();
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
                ],
                duration: myAudio.duration,
                playbackRate: myAudio.playbackRate,
                position: myAudio.currentTime
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
    if (myAudio.volume > 0) {
        mute.classList.remove('fa-volume-up', 'mr-3');
        mute.classList.add('fa-volume-off', 'mr-4');
        myAudio.volume = 0
    } else {
        mute.classList.remove('fa-volume-off', 'mr-4')
        mute.classList.add('fa-volume-up', 'mr-3')
        myAudio.volume = 1;
    }
});

///Show volume progress on angle
volumeShow.addEventListener('click', () => {
    if(volume.style.transform === 'scaleX(0)'){
        volume.style.transform = 'scaleX(1.0)';
        volumeShow.classList.remove('fa-angle-left');
        volumeShow.classList.add('fa-angle-right');

    }else{
        volume.style.transform = 'scaleX(0)';
        volumeShow.classList.remove('fa-angle-right');
        volumeShow.classList.add('fa-angle-left');

    }
});

///Playlist open and close
musicCollectionBtn.addEventListener('click', () => {
    musicCollection.style.height === '50vh' ? musicCollection.style.height = '0vh' : musicCollection.style.height = '50vh';
});

///Change music on click from playlist
musicCollectionContainer.forEach((el, id) => {

    ///Mouse hover effect
    musicCollectionContainer[id].addEventListener('mouseenter', () => {
        if (activeMusic !== id) {
            playBtnIcon[id].classList.add('activePlay');
            musicCollectionContainer[id].classList.add('activeContainer');
        }
    });

    musicCollectionContainer[id].addEventListener('mouseleave', () => {
        if (activeMusic !== id) {
            playBtnIcon[id].classList.remove('activePlay');
            musicCollectionContainer[id].classList.remove('activeContainer');
        }
    });

    ///Change music event
    playBtnIcon[id].addEventListener('click', () => {
        activeMusic = id;
        musicInfo();
        myAudio.play();
    });

    ///Like event
    like[id].addEventListener('click', () => {
        if (like[id].className === 'fa likeIcon mt-3 fa-heart-o') {
            like[id].classList.remove('fa-heart-o');
            like[id].classList.add('fa-heart');
        } else {
            like[id].classList.remove('fa-heart');
            like[id].classList.add('fa-heart-o');
        }
    });

    ///favourite event
    favorite[id].addEventListener('click', () => {
        if (favorite[id].className === 'fa favoriteIcon mt-3 ml-3 fa-plus') {
            favorite[id].classList.remove('fa-plus');
            favorite[id].classList.add('fa-check');
        } else {
            favorite[id].classList.remove('fa-check');
            favorite[id].classList.add('fa-plus');
        }
    });
});
