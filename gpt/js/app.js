/*
==========================================================
 CYBERBOOKMARKS
 app.js

 Punto di ingresso dell'applicazione
==========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);



/*
----------------------------------------------------------
Avvio applicazione
----------------------------------------------------------
*/

async function initializeApp(){


    console.log(
        "CYBERBOOKMARKS INITIALIZING..."
    );



    /*
    Carica bookmark dal JSON
    */

    await loadBookmarks();



    /*
    Disegna le card
    */

    renderCategories();



    /*
    Aggiorna statistiche
    */

    updateStatistics();



    /*
    Costruisce menu categorie
    */

    renderCategoryMenu();



    console.log(
        "SYSTEM ONLINE"
    );

}




/*
----------------------------------------------------------
Statistiche dashboard
----------------------------------------------------------
*/

function updateStatistics(){


    const bookmarkCounter =
        document.getElementById(
            "bookmark-count"
        );


    const categoryCounter =
        document.getElementById(
            "category-count"
        );



    if(bookmarkCounter){

        bookmarkCounter.textContent =
            getBookmarkCount();

    }



    if(categoryCounter){

        categoryCounter.textContent =
            getCategoryCount();

    }

}





/*
----------------------------------------------------------
Menu categorie superiore
----------------------------------------------------------
*/


function renderCategoryMenu(){


    const menu =
        document.getElementById(
            "categoryBar"
        );



    if(!menu){

        return;

    }



    menu.innerHTML="";



    bookmarksData.forEach(
        (category,index)=>{


            const button =
                document.createElement(
                    "button"
                );



            button.className =
                "category-button";



            button.innerHTML = `

                ${category.icon || "▣"}

                ${category.name}

                (${category.bookmarks.length})

            `;



            button.addEventListener(
                "click",
                ()=>{


                    const section =
                        document.getElementById(
                            slugify(category.name)
                        );



                    if(section){

                        section.scrollIntoView({

                            behavior:"smooth"

                        });


                    }


                }
            );



            if(index===0){

                button.classList.add(
                    "active"
                );

            }



            menu.appendChild(
                button
            );


        }

    );


}