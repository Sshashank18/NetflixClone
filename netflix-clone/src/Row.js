import React, {useEffect, useState} from 'react'
import axios from './axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const baseURL = 'https://image.tmdb.org/t/p/original/'

function Row({title , fetchUrl, isLargeRow}){
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(()=>{

        async function fetchData(){
            const request = await axios.get(fetchUrl);
            // https://api.themoviedb.org/3 + fetchURL
            setMovies(request.data.results);
            return request;
        }
        fetchData();

    },[fetchUrl]);  //if [], run once when the row loads, and don't run again
            //if [movies], run once when row loads and run every single time when movies changes

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
        };

    const handleClick = (movie) => {
        if(trailerUrl){
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.title || movie?.name || movie?.original_name || movie?.original_title || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search); 
                setTrailerUrl(urlParams.get('v'));
            })
            .catch(err => console.log(err));
        }
    }

    return(
        <div className='row'>
            <h2>{title}</h2>
            <div className='row_posters'>
                {movies.map(movie => (
                    <img 
                    key={movie.id}  // make a little quick as rendering time reduced
                    onClick = {()=>handleClick(movie)}
                    className={`row_poster ${isLargeRow && 'row_posterLarge'}`}
                    src={`${baseURL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}/>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row