let totalGIF = 44;
let device;
let tft;
let success = "#D1E7DD";
let failed = "#F8D7DA";
let warning = "#FFF3CD";
let uuidService = "dee13011-14d8-4e12-94af-a6edfeaa1af9";
let uuidChar = "dee13012-14d8-4e12-94af-a6edfeaa1af9";
let timerA=0;
function showAlert(color, text) {
    
    var alertDiv = document.querySelector('.alert');
    timerA=timerA+3000;
    alertDiv.classList.remove('hidden');
    alertDiv.style.backgroundColor = color;
    alertDiv.querySelector('p').innerText = text;
    setAlertTimeout(timerA)
}
function setAlertTimeout(timeout) {
    var alertDiv = document.querySelector('.alert');
    setTimeout(function () {
        alertDiv.classList.add('hidden');
    }, timeout);
}
async function showmenu() {
    var connect = document.querySelector('.connect');
    var menu = document.querySelector('.menu');
    connect.classList.add('hidden');
    menu.classList.remove('hidden');
}
async function showmatrix() {
    var matrix = document.querySelector('.matrix');
    matrix.classList.remove('hidden');
}
async function savematrix() {
    let selectedValues = [];
    let maxAnimations = 18;
    let welcomes = document.querySelector(`#welcome-select`);
    let speed = document.querySelector(`#speed`);
    for (let i = 0; i <= maxAnimations; i++) {
        let checkbox = document.querySelector(`#animation${i}`);
        if (checkbox && checkbox.checked) {
            selectedValues.push(checkbox.value);
        }
    }
    console.log(selectedValues);
    let binaryString = '0'.repeat(maxAnimations + 1).split('');
    selectedValues.forEach(value => {
        let index = parseInt(value);
        if (index < maxAnimations + 1) {
            binaryString[index] = '1';
        }
    });
    binaryString = binaryString.join('');
    let valuematrix = welcomes.value + binaryString + speed.value;
    console.log(valuematrix);
    kirim(valuematrix);
    offmenu();
}


async function offmenu() {
    var matrix = document.querySelector('.matrix');
    matrix.classList.add('hidden');
}

async function kirim(newValue) {
    if (device && device.gatt && device.gatt.connected && tft) {
        try {
            await tft.writeValue(new TextEncoder().encode(newValue));
            console.log('Nilai telah diubah menjadi:', newValue);
        } catch (error) {
            showAlert(failed, 'Perintah Gagal DI Update!');
            console.error('Gagal mengubah nilai:', error);
        }
    } else {
        showAlert(failed, 'Tidak Ada Device Terhubung, Harap Reload Halaman!');

    }
}

async function connect() {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [uuidService] }]
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(uuidService);
        tft = await service.getCharacteristic(uuidChar);
        console.log('Connected to ESP32');
        generateToggles(18);
        showmenu();

        showAlert(success, 'Device Terhubung!');
    } catch (error) {
        console.error('Error connecting to ESP32:', error);
        showAlert(failed, 'Device Gagal Terhubung!');
    }

}
if ('webkitSpeechRecognition' in window) {
    let recognition = new webkitSpeechRecognition();

    recognition.lang = 'id-ID'; // Bahasa Inggris Amerika, bisa disesuaikan

    recognition.continuous = false;

    recognition.interimResults = true;
    document.getElementById('start-recognition').onclick = function () {
        recognition.start();
        showAlert(warning, 'Menunggu Perintah Suara');
    };
    recognition.onresult = function (event) {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {

                interimTranscript += event.results[i][0].transcript;
            }
        }

        let valuevr = finalTranscript.toUpperCase();
        console.log(valuevr);
        
        const wordstoon = ["MENYALA", "START","ON","NYALA","GAS","PARTY"];
        const wordstooff = ["OF","STOP", "MATI","BERHENTI","NONAKTIF"];
        // Memeriksa apakah terdapat kata "MENYALA" di dalam valuevr
        if (valuevr.includes(wordstoon[0])||valuevr.includes(wordstoon[1])||valuevr.includes(wordstoon[2])||valuevr.includes(wordstoon[3])||valuevr.includes(wordstoon[4])||valuevr.includes(wordstoon[5])) {
            console.log('on');
            kirim("ON");
            showAlert(success, 'Perintah Suara Diterima');
        }else if (valuevr.includes(wordstooff[0])||valuevr.includes(wordstooff[1])||valuevr.includes(wordstooff[2])||valuevr.includes(wordstooff[3])||valuevr.includes(wordstooff[4])) {
            console.log('off');
            kirim("OFF");
            showAlert(success, 'Perintah Suara Diterima');
        }
         else {
            console.log('FALSE');
            showAlert(failed, 'Perintah Suara Tidak Dikenali');
        }

    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error detected: ' + event.error);
    };
} else {
    console.error('Speech recognition API not supported by this browser.');
}
function generateToggles(numToggles) {
    const container = document.getElementById('toggle-container');
    for (let i = 1; i <= numToggles; i++) {
        if (i % 2 === 1) {
            var grupToggleDiv = document.createElement('div');
            grupToggleDiv.className = 'grup-toggle';
            container.appendChild(grupToggleDiv);
        }
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'togle';
        const label = document.createElement('label');
        label.className = 'toggle-switch';
        const input = document.createElement('input');
        input.id = `animation${i}`;
        input.type = 'checkbox';
        input.name = `animation${i}`;
        input.value = i;
        const span = document.createElement('span');
        span.className = 'slider round';
        label.appendChild(input);
        label.appendChild(span);
        toggleDiv.appendChild(label);
        toggleDiv.appendChild(document.createTextNode(`Animation${i}`));
        grupToggleDiv.appendChild(toggleDiv);
    }
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
function isSimilar(target, phrase, threshold) {
    const distance = levenshteinDistance(target, phrase);
    return distance <= threshold;
}


