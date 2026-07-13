/*
==========================================================
 CYBERBOOKMARKS
 bookmarks.js

 Gestione caricamento e rendering bookmark
==========================================================
*/


let bookmarksData = [];



/*
----------------------------------------------------------
Carica il file JSON esterno
----------------------------------------------------------
*/

async function loadBookmarks(){

    try{

        const response = await fetch(
            "data/bookmarks.json"
        );


        if(!response.ok){

            throw new Error(
                "Errore caricamento bookmarks.json"
            );

        }


        const data = await response.json();


        bookmarksData = data.categories;


        return bookmarksData;


    }catch(error){


        console.error(
            "Bookmark loading error:",
            error
        );


        return [];


    }

}




/*
----------------------------------------------------------
Numero totale bookmark
----------------------------------------------------------
*/

function getBookmarkCount(){


    return bookmarksData.reduce(

        (total,category)=>{

            return total + category.bookmarks.length;

        },

        0

    );


}



/*
----------------------------------------------------------
Numero categorie
----------------------------------------------------------
*/

function getCategoryCount(){


    return bookmarksData.length;


}




/*
----------------------------------------------------------
Crea le categorie
----------------------------------------------------------
*/

function renderCategories(){


    const container =
        document.getElementById(
            "content"
        );


    container.innerHTML="";


    bookmarksData.forEach(
        
        category=>{


            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "category";


            section.id =
                slugify(category.name);



            section.innerHTML = `

                <h2 class="category-title">

                    ${category.icon || "▣"}

                    ${category.name}

                    <span>
                    (${category.bookmarks.length})
                    </span>

                </h2>


                <div class="bookmarks">

                    ${
                    category.bookmarks
                    .map(createBookmarkCard)
                    .join("")
                    }

                </div>

            `;



            container.appendChild(
                section
            );


        }

    );


}





/*
----------------------------------------------------------
Crea singola card
----------------------------------------------------------
*/


function createBookmarkCard(bookmark){


    return `

        <article class="card">


            <a href="${bookmark.url}"
               target="_blank">


                <div class="card-title">

                    
                    <!-- 
                    ${bookmark.icon || "◈"}
                    <i class="${bookmark.icon || 'fa-solid fa-link'}"></i>
                    -->
                    ${renderIcon(bookmark)}

                    ${bookmark.title}

                </div>


                <!--
                <div class="card-url">
                    ${bookmark.url}
                </div>
                -->


            </a>


        </article>


    `;


}





/*
----------------------------------------------------------
Genera slug per ID HTML
----------------------------------------------------------
*/

function slugify(text){


    return text

        .toLowerCase()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /(^-|-$)/g,
            ""
        );

}

function renderIcon(bookmark){

    if(!bookmark.icon){
        return `
        <i class="fa-solid fa-link"></i>
        `;
    }

    switch(bookmark.iconType){
        case "fa":

            return `

            <i class="${bookmark.icon}"></i>

            `;

        case "svg":

            return `

            <img 
            class="bookmark-svg"
            src="${bookmark.icon}"
            alt="${bookmark.title}">

            `;

        case "image":

            return `

            <img 
            class="bookmark-icon"
            src="${bookmark.icon}"
            alt="${bookmark.title}">

            `;

        default:

            return `
            <i class="fa-solid fa-link"></i>
            `;

    }

}