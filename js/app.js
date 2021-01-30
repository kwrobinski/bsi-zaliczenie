let kluczPubliczny = [];
let kluczPrywatny = [];
let liczbyPierwsze = generujTabliceLiczbPierwszych(3, 1000);

const pInput = document.getElementById("liczba-p");
const qInput = document.getElementById("liczba-q");
const nInput = document.getElementById("wartosc-n");
const eulerInput = document.getElementById("wartosc-euler");
const eInput = document.getElementById("wartosc-e");
const dInput = document.getElementById("wartosc-d");
const kluczPublicznyInput = document.getElementById("klucz-publiczny");
const kluczPrywatnyInput = document.getElementById("klucz-prywatny");
const tekstJawnyInput = document.getElementById("tekst-jawny");
const szyfrogramInput = document.getElementById("szyfrogram");

const generujPqBtn = document.getElementById("generuj-liczby");

/* Tworzy tablice liczb pierwszych z wybranego przedziału */
function generujTabliceLiczbPierwszych(min, max) {
    const result = new Array(max + 1).fill(0).map((_, i) => i);
    for (let i = 2; i <= Math.sqrt(max + 1); i++) {
        for (let j = i ** 2; j < max + 1; j += i) {
            delete result[j];
        }
    }
    return Object.values(result.slice(min));
}

/* Generuje liczby p i q */
function generujPQ() {
    let p, q;
    let rozmiar = liczbyPierwsze.length - 1;
    p = liczbyPierwsze[Math.floor(Math.random() * (rozmiar + 1))];
    q = liczbyPierwsze[Math.floor(Math.random() * (rozmiar + 1))];

    pInput.value = p;
    qInput.value = q;
    generujKlucze();
}

/* Zwraca największy wspólny dzielnik podanych liczb */
function nwd(a, b) {
    return (a === 0) ? b : nwd(b % a, a);
}

/* Sprawdza czy liczby są względnie pierwsze */
function czyWzgledniePierwsza(a, b) {
    return (nwd(a, b) === 1);
}

/* Funkcja szukjąca odrotności modulo */
function odwrotnoscModulo(a, m) {
    for (let x = 1; x < m; x++) {
        if (((a % m) * (x % m)) % m === 1) return x;
    }
}

function szybkiePotegowanieModulo(x, y, m) {
    let w = x;
    for (let i = 1; i < y; i++) {
        w = (w * x) % m;
    }
    return w;
}

/* Funkcja losująca e (wykładnik publiczny) */
function losujE(euler) {
    let liczby = [];
    for (let i = 1; i <= euler; i++) {
        if (czyWzgledniePierwsza(i, euler)) {
            liczby.push(i)
        }
    }
    return liczby[Math.floor(Math.random() * (liczby.length + 1))];
}

function ustawWartosciWygenerowanychKluczy(e, d, n) {
    kluczPubliczny = [e, n];
    kluczPrywatny = [d, n];
    kluczPrywatnyInput.value = `${kluczPrywatny.toString()}`;
    kluczPrywatnyInput.placeholder = `${kluczPrywatny.toString()}`;
    kluczPublicznyInput.value = `${kluczPubliczny.toString()}`;
    kluczPublicznyInput.placeholder = `${kluczPubliczny.toString()}`;
    tekstJawnyInput.max = n - 1;
}

/* Funkcja generująca parę kluczy */
function generujKlucze() {
    let q = qInput.value;
    let p = pInput.value;
    let n = p * q;
    let euler = (p - 1) * (q - 1);
    let e = losujE(euler);
    let d = odwrotnoscModulo(e, euler);
    ustawWartosciWygenerowanychKluczy(e, d, n);
    nInput.value = n;
    eulerInput.value = euler;
    eInput.value = e;
    dInput.value = d;
}

function parsujKlucze() {
    kluczPrywatny = kluczPrywatnyInput.value.split(',');
    kluczPubliczny = kluczPublicznyInput.value.split(',');
}

function zaszyfrujLubOdszyfruj() {
    parsujKlucze();
    let szyfrogram = szyfrogramInput.value;
    let tekstJawny = tekstJawnyInput.value;

    let zaszyfrowane = szybkiePotegowanieModulo(tekstJawny, kluczPubliczny[0], kluczPubliczny[1]);
    let rozszyfrowane = szybkiePotegowanieModulo(szyfrogram, kluczPrywatny[0], kluczPrywatny[1]);

    tekstJawnyInput.value = rozszyfrowane;
    szyfrogramInput.value = zaszyfrowane;
}

generujPqBtn.addEventListener("click", generujPQ);
kluczPublicznyInput.addEventListener("input", sprawdzCzyZmienionoKlucze);
kluczPrywatnyInput.addEventListener("input", sprawdzCzyZmienionoKlucze);