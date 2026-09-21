// =======================================================================
// TAMAMEN ÖZGÜN VE TELİFSİZ PROSEDÜREL SES MOTORU (WEB AUDIO API)
// Bu dosyadaki tüm sesler hiçbir harici MP3/WAV dosyası olmadan,
// tarayıcının yerleşik ses sentezleyicisi (matematiksel sinüs/gürültü dalgaları)
// ile kod üzerinden canlı üretilir. Google Play Store telif kurallarına %100 uygundur.
// =======================================================================

let audioCtx = null;

const getAudioContext = () => {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

// 1. BUTON VE MENÜ TIKLAMA SESİ (Yumuşak Kısa Pop)
export const playClick = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch {
        // Tarayıcı kısıtlaması durumunda sessizce geç
    }
};

// 2. KANCA FIRLATMA VE SUYA DÜŞME SESİ (Rüzgar Islığı + Su Şapırtısı)
export const playHookThrow = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;

        // Islık efekti
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.35);

        oscGain.gain.setValueAtTime(0.12, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);

        // Su şapırtısı (Noise Buffer + Bandpass Filter)
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now + 0.2);
        filter.frequency.linearRampToValueAtTime(200, now + 0.45);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.setValueAtTime(0.2, now + 0.2);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now + 0.2);
        noise.stop(now + 0.45);
    } catch {
        // ignore
    }
};

// 3. BALIK YAKALAMA VE BAŞARI SESİ (Neşeli Çan / Ding)
export const playCatchFish = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Akor)
        const now = ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.18, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.35);
        });
    } catch {
        // ignore
    }
};

// 4. ÜRETİM VE İNŞAAT SESİ (Çekiç / Ahşap Vuruşu)
export const playCraft = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        [0, 0.1].forEach((delay, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(idx === 0 ? 180 : 260, now + delay);
            osc.frequency.exponentialRampToValueAtTime(60, now + delay + 0.08);

            gain.gain.setValueAtTime(0.15, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.08);
        });
    } catch {
        // ignore
    }
};

// 5. SU İÇME SESİ (Fokurtu / Yutkunma)
export const playDrink = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        [300, 420, 360].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            osc.frequency.exponentialRampToValueAtTime(freq - 120, now + idx * 0.12 + 0.09);

            gain.gain.setValueAtTime(0.16, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.09);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.09);
        });
    } catch {
        // ignore
    }
};

// 6. YEMEK YEME SESİ (Çıtır Çiğneme)
export const playEat = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        [0, 0.08, 0.16].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220 + Math.random() * 80, now + delay);
            osc.frequency.exponentialRampToValueAtTime(90, now + delay + 0.06);

            gain.gain.setValueAtTime(0.14, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.06);
        });
    } catch {
        // ignore
    }
};

// 7. KÖPEK BALIĞI / TEHLİKE UYARISI (Derin Gerilim Kalp Atışı)
export const playSharkAlert = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        [0, 0.18].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now + delay);
            osc.frequency.exponentialRampToValueAtTime(40, now + delay + 0.14);

            gain.gain.setValueAtTime(0.25, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.14);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.14);
        });
    } catch {
        // ignore
    }
};

// 8. OYUN BİTTİ (Hazin Melodi)
export const playGameOver = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const notes = [293.66, 261.63, 220.00, 174.61]; // D4, C4, A3, F3
        const now = ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.25);

            gain.gain.setValueAtTime(0.18, now + idx * 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.25);
            osc.stop(now + idx * 0.25 + 0.45);
        });
    } catch {
        // ignore
    }
};

// 9. ZAFER VE KURTULMA MELODİSİ (Coşkulu Fanfar)
export const playVictory = (isSoundEnabled = true) => {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        const now = ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);

            gain.gain.setValueAtTime(0.2, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.6);
        });
    } catch {
        // ignore
    }
};
