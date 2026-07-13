/*
==========================================================
 CYBERBOOKMARKS

 clock.js

 Gestione data e ora
==========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    initClock
);



function initClock(){


    updateClock();


    setInterval(
        updateClock,
        1000
    );


}



function updateClock(){


    const clock =
        document.getElementById(
            "clock"
        );


    if(!clock){

        return;

    }



    const now =
        new Date();



    const options = {


        weekday:"short",

        day:"2-digit",

        month:"short",

        year:"numeric",

        hour:"2-digit",

        minute:"2-digit",

        second:"2-digit"


    };



    clock.textContent =
        now.toLocaleString(
            "it-IT",
            options
        );


}