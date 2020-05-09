const myAudio = document.getElementById('myAudio');
const durationAudio = document.getElementById('durationAudio');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const timeAudio = document.getElementById('timeAudio');
const playFa = document.querySelector('.fa-play');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progressBar');
const titleAuthor = document.getElementById('titleAuthor');
const titleName = document.getElementById('titleName');
const titleImg = document.querySelector('.titleImg');
const effect = document.querySelector('.effect');
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
        effect.style.width = '30px'
        effect.style.height = '30px'
    } else {
        play(0, 'fa-pause', 'fa-play');
        myAudio.pause();
        effect.style.width = '0px'
        effect.style.height = '0px'
    }
}

playBtn.addEventListener('click', () => {
    musicCtrl();
});

setInterval(() => {
        const percentage = myAudio.currentTime / myAudio.duration * 100;
        timeMath(myAudio.currentTime, timeAudio);
        timeMath(myAudio.duration, durationAudio);
        progress.value = percentage;
        if(myAudio.currentTime === myAudio.duration){
            activeMusic++;
            musicInfo();
            musicCtrl(1);
        }
        myAudio.paused === true ? play(0, 'fa-pause', 'fa-play', false) : play(1, 'fa-play', 'fa-pause');
}, 30);

///controls for pc
progress.addEventListener("mousedown", function (e) { seeking = true; seekPc(e, 'pc'); });

progress.addEventListener("mousemove", function (e) { seekPc(e, 'pc'); });

progress.addEventListener("mouseup", function () { seeking = false; });

function seekPc(e) {
    if (seeking) {
        let x = e.clientX - progress.offsetLeft,
            clickedValue = x * progress.max * myAudio.duration / 100 / progress.offsetWidth;
        myAudio.currentTime = clickedValue;
    }
}

///controls for mobile
progress.addEventListener("touchstart", function (e) { seeking = true; seekMob(e); });

progress.addEventListener("touchmove", function (e) { seekMob(e); });

progress.addEventListener("touchend", function () { seeking = false; });

function seekMob(e) {
    if (seeking) {
        let x = e.changedTouches[0].clientX - progress.offsetLeft,
            clickedValue = x * progress.max * myAudio.duration / 100 / progress.offsetWidth;
        myAudio.currentTime = clickedValue;
    }
}

nextBtn.addEventListener('click', () => {
    if (activeMusic === music.length - 1) {
        activeMusic = 0;
        musicInfo();
        musicCtrl(1);
    } else {
        activeMusic++;
        musicInfo();
        musicCtrl(1);
    }
    console.log(activeMusic);
});

backBtn.addEventListener('click', () => {
    if (activeMusic === 0 || myAudio.currentTime > 2) {
        myAudio.currentTime = 0;
        musicCtrl(1);
    } else {
        activeMusic--;
        musicInfo();
        musicCtrl(1);
    }
    console.log(activeMusic);
});

/* let x = e.pageX - this.offsetLeft,
y = e.pageY - this.offsetTop,
clickedValue = x * this.max / this.offsetWidth;
myAudio.currentTime = clickedValue * 2;
progress.value = clickedValue;
console.log(clickedValue / 2); */