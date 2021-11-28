var MEDIA_ELEMENT_NODES = new WeakMap();
var da = false;
class Microphone {
    constructor(fftSize = 2048) {
        this.audioContext = new (window.webkitAudioContext || window.AudioContext)();
        // console.log(MEDIA_ELEMENT_NODES)
        // console.log(MEDIA_ELEMENT_NODES.has(_audio))
        // // if (MEDIA_ELEMENT_NODES.has(_audio)) {
        // //     this.microphone = MEDIA_ELEMENT_NODES.get(_audio);
        // // } else {
        // //     MEDIA_ELEMENT_NODES.set(_audio, this.microphone);
        // // }
        // if(!da){
        // }
        this.microphone = this.audioContext.createMediaElementSource(_audio);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = fftSize;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        this.microphone.connect(this.analyser);
    }
    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSample = [...this.dataArray].map(e => e / 128 - 1);
        return normSample;
    }
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSample = [...this.dataArray].map(e => e / 128 - 1);
        let sum = 0;
        for (let i = 0; i < normSample.length; i++) {
            sum += normSample[i] * normSample[i];
        }
        return Math.sqrt(sum / normSample.length);
    }

}