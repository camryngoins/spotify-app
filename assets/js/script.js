let artistNameEl = $('#artist');
let artistAlbumEl = $('#artistAlbum');
let currentArtistName = $('#currentArtist');
let artistBioEl = $('#artist-bio');
let albumCard = null;
let albumArt = null;
let albumTitle = null;


function aristSearch(event) {
	event.preventDefault();
	let artistName = artistNameEl.val();
	let artistNameSpace = artistName.replace(" ", "%20")
	fetch("https://spotify23.p.rapidapi.com/search/?q="+artistNameSpace+"&type=artists&numberOfTopResults=1", {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "spotify23.p.rapidapi.com",
			"x-rapidapi-key": "14e6afb172mshd218eb3965bc14ap1190f1jsn30af3eaa08bd"
		}
	})
	.then(function(responce) {
		return responce.json();
	})
	.then(function(data) {
        // clear artist header and change name to artist searched
        currentArtistName.text('');
        currentArtistName.text(data.artists.items[0].data.profile.name);
        // console.log(data.artists.items[0].data.profile.name);

		let artistUri = data.artists.items[0].data.uri;
		let artistCode = artistUri.slice(15);
		console.log(artistCode);
		artistAlbums(artistCode);
		artistBio(artistName);
	})
	.catch(function(err) {
		console.error(err);
	});
};

function artistAlbums(artistCode) {
	fetch("https://spotify23.p.rapidapi.com/artist_albums/?id="+artistCode+"&offset=0&limit=50", {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "spotify23.p.rapidapi.com",
			"x-rapidapi-key": "50a402ad5dmsh8a86b4453bff8b5p1cd337jsn4a81dd6a5d42"
		}
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		let albumArr = data.data.artist.discography.albums.items;
		artistAlbumEl.empty(); 
		// get album array
		// console.log(albumArr);
		for (var i=0; i<albumArr.length; i++) {
			// console.log(albumArr[i].releases.items);
		// create album card from api data
			var albumCard = document.createElement('div');
			albumCard.classList.add('card');
		
            // console.log(albumArr[i].releases.items[0].coverArt.sources[0]);
			// set album image to link to spotify web player
			var albumLink = document.createElement('a');
			albumLink.setAttribute("href", "https://open.spotify.com/album/"+albumArr[i].releases.items[0].id);
			albumLink.setAttribute("target", "_blank");

			var albumArt = document.createElement('img');
			albumArt.setAttribute("src", albumArr[i].releases.items[0].coverArt.sources[0].url);
			console.log(albumArr[i].releases.items[0].id);

			albumArt.classList.add('card-img-top');
            albumArt.classList.add('cover-art');
			albumLink.append(albumArt);

			albumCard.append(albumLink);

			var albumTitle = document.createElement('h4');
			albumTitle.textContent = albumArr[i].releases.items[0].name;
			albumTitle.classList.add('card-title');
			albumCard.append(albumTitle);
		
			artistAlbumEl.append(albumCard);
		}
	})
	.catch(function(err) {
		console.log(err);
	})
};

function artistBio(artistName) {
	let artistNameDash = artistName.replace(" ","_")
    let wikiUrl = 'https://en.wikipedia.org/wiki/' + artistNameDash
    let apiUrl = "https://en.wikipedia.org/w/api.php?explaintext&" +
    new URLSearchParams({
        origin: "*",
        action: "query",
        titles: artistName,
        format: "json",
        prop: "extracts",
        redirects: "1",
    });
    fetch(apiUrl)
    .then(function(responce) {
        if (responce.ok) {
            responce.json().then(function(data) {
                console.log(data);
                artistBioEl.empty();
                let pageId = Object.getOwnPropertyNames(data.query.pages)[0]
                let artistBio = data.query.pages[pageId].extract
                if (artistBio.length > 1001) {
                    artistBio = artistBio.substring(0, 1000) + "...";
                }
                let wikiLink = $("<a></a>", {href: wikiUrl}).text("view more");
                artistBioEl.append(artistBio, wikiLink);


            })
        } else {
            console.log(err);
        }
    })
    .catch(function() {
        console.log(err);
    })
};



$("#search-form").submit(aristSearch);