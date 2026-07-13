/*
==========================================================
 CYBERBOOKMARKS
 search.js

 Ricerca live bookmark
==========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    initSearch
);



function initSearch(){


    const input =
        document.getElementById(
            "searchInput"
        );


    if(!input){

        console.error(
            "Search input not found"
        );

        return;

    }



    input.addEventListener(
        "input",
        handleSearch
    );


}




function handleSearch(event){


    const query =
        event.target.value
        .toLowerCase()
        .trim();



    if(query === ""){


        renderCategories();


        return;

    }



    const filtered =
        bookmarksData
        .map(category=>{


            return {


                name:category.name,

                icon:category.icon,


                bookmarks:
                    category.bookmarks.filter(
                        bookmark=>{


                            return (

                                bookmark.title
                                .toLowerCase()
                                .includes(query)

                                ||

                                bookmark.url
                                .toLowerCase()
                                .includes(query)

                            );


                        }
                    )


            };


        })
        .filter(
            category =>
                category.bookmarks.length > 0
        );



    renderSearchResults(filtered);


}




function renderSearchResults(results){


    const container =
        document.getElementById(
            "content"
        );



    container.innerHTML="";



    if(results.length===0){


        container.innerHTML=`

            <div class="category">

                <h2 class="category-title">

                    ⚠ NO RESULTS FOUND

                </h2>

            </div>

        `;


        return;

    }



    results.forEach(category=>{


        const section =
            document.createElement(
                "section"
            );


        section.className="category";



        section.innerHTML=`

            <h2 class="category-title">

                ${category.icon || "▣"}

                ${category.name}

            </h2>


            <div class="bookmarks">

                ${
                    category.bookmarks
                    .map(createBookmarkCard)
                    .join("")
                }

            </div>

        `;



        container.appendChild(section);


    });


}