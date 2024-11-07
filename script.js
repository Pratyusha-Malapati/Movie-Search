const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a18a4c3abe6c63b9d003880cedebf790";
const DISCOVERSEARCH = "https://api.themoviedb.org/3/discover/movie?api_key=a18a4c3abe6c63b9d003880cedebf790";
const GENRESAPI = "https://api.themoviedb.org/3/genre/movie/list?api_key=a18a4c3abe6c63b9d003880cedebf790&language=en-US"
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=a18a4c3abe6c63b9d003880cedebf790&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const toolbar = document.getElementById("toolbar");
const genresd = document.getElementById("genres");
const sortbyd = document.getElementById("sortby");
const yeard = document.getElementById("year");
const main = document.getElementById("main");
const body = document.getElementById("body");
const form = document.getElementById("form");
const search = document.getElementById("search");
const btn_next = document.getElementById("btn_next");
const btn_prev = document.getElementById("btn_prev");

var current_page = 1;
var numPages = 0;
var searchTerm ="";

// initially get fav movies
console.log(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
getGenres(GENRESAPI);

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        if(searchTerm){
            getMovies(SEARCHAPI + searchTerm + "&page=" + current_page);
        }else{
            getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
        }
    }
}

function nextPage()
{
    if (current_page < numPages) {
        current_page++;
        if(searchTerm){
            getMovies(SEARCHAPI + searchTerm + "&page=" + current_page);
        }else{
            getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
        }
        
    }
}

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData);
    numPages = respData.total_pages;

    if (current_page < 1) current_page = 1;
    if (current_page > numPages) current_page = numPages;

    if (current_page == 1) {
        btn_prev.disabled = true;
    } else {
        btn_prev.disabled = false;
    }

    if (current_page == numPages) {
        btn_next.disabled = true;
    } else {
        btn_next.disabled = false;
    }

    showMovies(respData.results);
}

function showMovies(movies) {
    // clear main
    main.innerHTML = "";
    console.log(movies.length)

    if (movies.length > 0){

        movies.forEach((movie) => {
            const { poster_path, title, vote_average, overview, release_date, genre_ids } = movie;

            (async function(){
                var genre = await findGenre(genre_ids.slice(0,1).shift());

                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                
                movieEl.innerHTML = `
                <span class="${getClassByRate(
                    vote_average
                )}"><i class="fas fa-star"></i> ${vote_average}</span>    
                <img class="poster"
                        src="${checkImageExists(poster_path)}"
                        alt="${title}"/>
                    
                <div class="movie-info">
                    <h3>${title}</h3> <p>${genre}</p><p class="year"><b>${release_date.slice(0, release_date.indexOf('-'))}</b></p>
                </div>
                <div class="overview" >
                <h3>${title}</h3>
                    <h3>Overview:</h3>
                    ${overview}
                </div>
                    
                `;
                
                main.appendChild(movieEl);
            })()
            
        });
    }else{
        const no_movie = document.createElement("div");
        no_movie.classList.add("no_movies");
        no_movie.ad
        no_movie.innerHTML = `
        No Movies Found
        `;
        main.appendChild(no_movie);
    }
}

async function getGenres(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData);
    showGenres(respData.genres);
}


function showGenres(genres) {
    genres.forEach((genre) => {
        const { id, name } = genre;

        const genreEl = document.createElement("option");
        genreEl.classList.add("genre");
        genreEl.value = (id);
        genreEl.innerHTML = `${name}`;
        genresd.appendChild(genreEl);
        
    });
}

async function findGenre(gid) {
    const resp = await fetch(GENRESAPI);
    const respData = await resp.json();
    var genress = respData.genres
    var genreg = "";
    console.log(genress[0].id == gid);

    for (let i = 0; i < genress.length; i++) {
        if (gid == genress[i].id ){
            console.log(genress[i].name);
            return genress[i].name;
        }
        
    }

}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}


genresd.onchange = function() {
    current_page = 1;
    getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
}

sortbyd.onchange = function() {
    current_page = 1;
    getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
}

yeard.onchange = function() {
    current_page = 1;
    getMovies(DISCOVERSEARCH + "&sort_by=" + sortbyd.value + "&with_genres=" + genresd.value + "&primary_release_year=" + year.value + "&page=" + current_page);
}

form.addEventListener("input", (e) => {
    e.preventDefault();
    current_page = 1;
    searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm + "&page=" + current_page);
        toolbar.style.display = "none";
    }
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    current_page = 1;
    searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm + "&page=" + current_page);
        toolbar.style.display = "none";
        search.value = "";
    }
});

function checkImageExists(image) {
    if (image != null) {
        return IMGPATH + image;
    }
    return "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg";

}