let create=false;
function main() {
    const widthCanvas = window.innerWidth;
    const heightCanvas = window.innerHeight;
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    console.dir(canvas);
    canvas.width = widthCanvas;
    canvas.height = heightCanvas;
    var microphone;
    var samples = [0];
    var volume = 0;



    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput) {
            const sound = micInput * 100;
            if (sound > this.height) {
                this.height = sound;
            } else {
                this.height -= this.height * 0.03;
            }
        }
        draw(context, volume) {
            context.strokeStyle = this.color;
            context.lineJoin = "red"

            context.save();
            context.rotate(this.index * 0.03);
            canvas.style.transform=`rotate(${this.index * 0.0053})`;

            context.translate(0, 0);
            context.scale(0.5 + volume * 0.2, 0.5 + volume * 0.2);


            context.beginPath();
            context.moveTo(this.x+10, this.y);
            context.lineTo(this.y, this.height);
            context.stroke();
            context.strokeRect(this.y, this.height, this.height, 10)

            context.beginPath();
            // context.arc(this.y,this.height,this.height*0.2+10,0,Math.PI*2)
            context.stroke();


            context.restore();
        }
    }
    const fftSize = 512;
    console.log(create)
    if(create){
        microphone = new Microphone(fftSize);
    }

    bars = [];
    function createBars() {
        for (let i = 0; i < (fftSize / 2); i++) {
            let color = `hsl(${i * 360 / (fftSize / 2)},100%,50%)`
            bars.push(new Bar(0, i, 10, 50, color, i))
        }
    }
    createBars();
    let a = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(microphone){
            volume = microphone.getVolume();
            samples = microphone.getSamples();
        }
        a += 0.001;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(volume*0.3+a);
        bars.forEach((bar, i) => {
            bar.update(samples[i]);
            bar.draw(ctx, volume);
        })
        ctx.restore();
        requestAnimationFrame(animate);
    }
    animate();
}

audio.addEventListener("play",e=>{
    if(!create){
        create = true;
        main();
    }
})

main();;
