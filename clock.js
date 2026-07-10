function updateClock() {

    const now = new Date();

    const giorni = [
        "Domenica",
        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato"
    ];

    const mesi = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre"
    ];

    const ore = String(now.getHours()).padStart(2, "0");
    const minuti = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${ore}:${minuti}`;

    document.getElementById("date").textContent =
        `${giorni[now.getDay()]} ${now.getDate()} ${mesi[now.getMonth()]} ${now.getFullYear()}`;

}

updateClock();

setInterval(updateClock,1000);