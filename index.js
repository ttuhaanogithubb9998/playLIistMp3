const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playList = $(".list-song");
const imgHighlight = $(".highlight-img-song img")
const headingSong = $(".highlight-name-song");
const imgSong = $(".highlight-img-song img");
const audio = $(".audio");
const _audio = $("._audio");
const playBtn = $(".playBtn");
const timeNow = $(".time-now");
const duration = $(".duration")
const line = $(".line p");
const nextSong = $(".next-song");
const repeatSong = $(".repeat-song");
const previouslySong = $(".previously-song");
const randomSong = $(".random-song");
const canvas = document.getElementById('myCanvas');

var i;
var itemSongs;

const app = {
    currentIndex: 0,
    config: {
        isRan: false,
        isRepeat: false,
        currentIndex: 0,
    },
    songs: [
        {
            name: "Cưới Thôi",
            singer: "MASIU x MASEW x BRAY x TAP",
            path: "./audio/CuoiThoi.mp3",
            image: "./img/CuoiThoi.jpg"
        },
        {
            name: "Dịu Dàng Em Đến",
            singer: "Erik",
            path: "./audio/DiuDangEmDen.mp3",
            image: "./img/DiuDangEmDen.jpg"
        },
        {
            name: "Đường Tôi Chở Em Về",
            singer: "Bùi Trương Linh",
            path: "./audio/DuongToiChoEmVe.mp3",
            image: "./img/DuongToiChoEmVe.jpg"
        },
        {
            name: "Hương",
            singer: "Văn Mai Hương",
            path: "./audio/Huong.mp3",
            image: "./img/Huong.jpg"
        },
        {
            name: "Phải Chăng Em Đã Yêu",
            singer: "Juky San",
            path: "./audio/PhaiChangEmDaYeu.mp3",
            image: "./img/PhaiChangEmDaYeu.jpg"
        },
        {
            name: "Độ Tộc 2",
            singer: "Masew, Độ Mixi, Phúc Du, V.A",
            path: "./audio/DoToc2.mp3",
            image: "./img/DoToc2.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Sơn Tùng M-TP",
            path: "./audio/MuonRoiMaSaoCon.mp3",
            image: "./img/MuonRoiMaSaoCon.jpg"
        },
        {
            name: "Đếm Cừu",
            singer: "Han Sara, Kay Trần",
            path: "./audio/DemCuu.mp3",
            image: "./img/DemCuu.jpg"
        },
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return (
                `<div class="item-song">
                    <div class="item-img-song">
                        <img src="${song.image}" alt="" />
                    </div>
                    <div class="song">
                        <div class="name-song">${song.name}</div>
                        <div class="singer">${song.singer}</div>
                    </div>
                </div>`
            )
        });
        playList.innerHTML = htmls.join('');
        itemSongs = $$(".item-song")
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {

            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    getConfig: function () {
        if (localStorage.getItem("clientConfig")) {
            this.config = JSON.parse(localStorage.getItem("clientConfig"))
            this.currentIndex = this.config.currentIndex
            if (this.config.isRan)
                randomSong.classList.add("ranTrue")
            if (this.config.isRepeat)
                repeatSong.classList.add("repeatTrue")
        }
    },
    setConfig: function () {
        localStorage.setItem("clientConfig", JSON.stringify(this.config))
    },
    handleEvents: function () {
        const widthImg = imgHighlight.width;//Lấy width ban đầu và lưu lại
        const widthLine = line.parentElement.offsetWidth;
        const imgAnimate = imgSong.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity
        })
        var isPlaying = false;
        var isIntoView = false;


        imgAnimate.pause();
        // hiệu ứng thu nhỏ img song
        playList.addEventListener("scroll", e => {
            if (!isIntoView) {
                var scrollNow = e.target.scrollTop;
                imgHighlight.style.width = widthImg - scrollNow > 0 ? widthImg - scrollNow + "px" : "0px"
                playList.style.height = 300 + scrollNow > 300 + widthImg ? 300 + widthImg + "px" : 300 + scrollNow + "px"
            }
        });
        // bật tắt nhạc
        playBtn.addEventListener("click", pp = (e) => {
            if (isPlaying) {
                audio.pause();
                _audio.pause();
            } else {
                audio.play();
                _audio.play();
            }
            audio.onplay = function () {
                playBtn.classList.add("play-song")
                playBtn.classList.remove("pause-song")
                isPlaying = true;
                imgAnimate.play();
               
            }
            audio.onpause = function () {
                playBtn.classList.remove("play-song")
                playBtn.classList.add("pause-song")
                isPlaying = false;
                imgAnimate.pause();
            }

            audio.ontimeupdate = function () {
                let width = audio.currentTime / audio.duration * 100;
                let s;
                let m;
                line.style.width = width + "%";
                s = app.formatTime(audio.currentTime).s;
                m = app.formatTime(audio.currentTime).m;
                timeNow.textContent = m + ":" + s;
                s = app.formatTime(audio.duration).s;
                m = app.formatTime(audio.duration).m;
                if (m && s) {
                    duration.textContent = m + ":" + s;
                } else {
                    duration.textContent = "00:00"
                }

                if (width == 100) {
                    Next();
                }
            };

        });
        // tua bài
        line.parentElement.addEventListener("click", e => {
            let x = e.clientX - e.target.getBoundingClientRect().left
            let Xn = x / widthLine * 100;
            Xn = Xn > 99 ? 100 : Xn;
            Xn = Xn < 1 ? 0 : Xn;
            line.style.width = Xn + "%";
            audio.currentTime = audio.duration / 100 * Xn;
            _audio.currentTime = _audio.duration / 100 * Xn;
        });

        //
        nextSong.addEventListener("click", Next = e => {
            if (app.config.isRan) {
                this.currentIndex = this.ranCurrentIndex(this.currentIndex, this.songs.length);
                if (this.currentIndex == undefined) {
                    Next();
                    return;
                }
            } else if (app.config.isRepeat) { } else {
                this.currentIndex++;
                this.currentIndex = this.currentIndex >= this.songs.length ? this.currentIndex = 0 : this.currentIndex;
            }
            this.activeItemSong(this.currentIndex);
            this.loadCurrentSong();
            pp();
            audio.play();
            _audio.play();
        });

        //
        randomSong.addEventListener("click", Random = e => {
            if (app.config.isRan) {
                app.config.isRan = false;
                randomSong.classList.remove("ranTrue");
            } else {
                app.config.isRepeat = false;
                repeatSong.classList.remove("repeatTrue");
                app.config.isRan = true;
                randomSong.classList.add("ranTrue")
            }
            this.setConfig();
        });

        //
        repeatSong.addEventListener("click", Repeat = e => {
            if (app.config.isRepeat) {
                app.config.isRepeat = false;
                repeatSong.classList.remove("repeatTrue");
            } else {
                app.config.isRan = false;
                randomSong.classList.remove("ranTrue");
                app.config.isRepeat = true;
                repeatSong.classList.add("repeatTrue")
            }
            this.setConfig();
        });

        //
        previouslySong.addEventListener("click", e => {
            if (app.config.isRan) {
                this.currentIndex = this.ranCurrentIndex(this.currentIndex, this.songs.length);
                if (this.currentIndex == undefined) {
                    Next();
                    return;
                }
            } else if (app.config.isRepeat) { } else {
                this.currentIndex--;
                this.currentIndex = this.currentIndex < 0 ? this.currentIndex = this.songs.length - 1 : this.currentIndex;
            }
            this.activeItemSong(this.currentIndex);
            this.loadCurrentSong();
            pp();
            audio.play();
            _audio.play();
        });

        // khi click vào item song
        itemSongs.forEach((itemSong, i) => {
            itemSong.onclick = function () {
                app.activeItemSong(i)
                app.currentIndex = i;
                app.loadCurrentSong();
                pp();
                audio.play();
                _audio.play();
            }
        })

    },
    activeItemSong: function (index) {
        itemSongs.forEach((itemSong, i) => {
            if (i == index) {
                itemSong.classList.add('item-active');
                itemSong.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                itemSong.classList.remove("item-active")
            }
        });
        this.config.currentIndex = index;
        this.setConfig();
    },
    loadCurrentSong: function () {
        headingSong.textContent = this.currentSong.name;
        imgSong.src = this.currentSong.image;
        audio.src = this.currentSong.path;
        _audio.src = this.currentSong.path;
    },
    formatTime: function (time) {
        let s;
        let m;
        s = time
        m = Math.floor(s / 60);
        s = Math.floor(s % 60);
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return { s: s, m: m }
    },
    ranCurrentIndex: function (currentIndex, length) {
        i = Math.floor(Math.random() * 100) % length
        if (currentIndex == i) {
            this.ranCurrentIndex(currentIndex);
        } else {
            return i;
        }
    },
    start: function () {
        // định nghĩa các thuộc tính cho oject (app)
        this.defineProperties();

        // render playlist
        this.render();

        // lấy dữ liệu config    từ bộ nhớ client
        this.getConfig();

        // lắng nghe / xử lý các sự kiện (dom events)
        this.handleEvents();

        // load song lần đầu
        this.loadCurrentSong();

        // active item
        this.activeItemSong(this.currentIndex);

    }
}
app.start();

