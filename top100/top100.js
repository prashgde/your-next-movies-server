const fs = require('fs');
const util = require('util');
const { tsv2json } = require('tsv-json');
const axios = require('axios');
require('dotenv').config();

(async () => {
    try {
        const API_KEY = process.env.API_KEY;
        const movies = [];
        const moviesWithRequiredFields = [];
        const readFile = util.promisify(fs.readFile);
        const writeFile = util.promisify(fs.writeFile);
        const allMoviesTSV = await readFile('top300.tsv', 'utf-8');
        const allMovies = tsv2json(allMoviesTSV);
        let allMovieIds = allMovies.map(movie => movie[0]);

        for (const movieId of allMovieIds) {
            const url = `http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`;
            const response = await axios.get(url);
            movies.push(response);
        }

        let id = 0;
        let count = 0;

        for (const movie of movies) {
            count++;
            if (id === 100)
                break;
            if (movie.data.Type)
                if (movie.data.Type === 'movie')
                    if (movie.data.Title && movie.data.Year && movie.data.Genre && movie.data.imdbRating) {
                        moviesWithRequiredFields.push({
                            name: movie.data.Title,
                            year: movie.data.Year,
                            genre: movie.data.Genre,
                            rating: movie.data.imdbRating,
                            id: id++
                        });
                    }
        }

        console.log(`Searched ${count}/300 top movies`);
        await writeFile('top100.json', JSON.stringify(moviesWithRequiredFields, null, 4));
    } catch (err) {
        console.log(err);
    }
})();