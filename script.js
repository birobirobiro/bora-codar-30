// https://developer.themoviedb.org/reference/movie-popular-list
async function getMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTNjMWY3MDUzNzRlMzFjN2Y0YzQwNmQ4MDBkNTE5YiIsInN1YiI6IjY0YzY4ZmU4ZWVjNWI1MDBmZjUyNGYwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H2gzkxXiU0-Fb2wKqMHzqmsVcK8zfGsh2hXKqJK4xFg'
    }
  };

  try {
    return fetch('https://api.themoviedb.org/3/movie/popular', options)
      .then(response => response.json())
  }catch(error) {
    console.log(error)
  }

}

// puxar informações extras do filme
// https://api.themoviedb.org/3/movie/{movie_id}
async function getMoreInfo(id) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTNjMWY3MDUzNzRlMzFjN2Y0YzQwNmQ4MDBkNTE5YiIsInN1YiI6IjY0YzY4ZmU4ZWVjNWI1MDBmZjUyNGYwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H2gzkxXiU0-Fb2wKqMHzqmsVcK8zfGsh2hXKqJK4xFg'
    }
  };

  try {
    return fetch('https://api.themoviedb.org/3/movie/' + id, options)
    .then(response => response.json())
  } catch (error) {
    console.log(error)
  }
}

// quando clicar no botão de assistir trailer
// https://api.themoviedb.org/3/movie/{movie_id}/videos
async function watch(e) {
  const movie_id = e.currentTarget.dataset.id
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTNjMWY3MDUzNzRlMzFjN2Y0YzQwNmQ4MDBkNTE5YiIsInN1YiI6IjY0YzY4ZmU4ZWVjNWI1MDBmZjUyNGYwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H2gzkxXiU0-Fb2wKqMHzqmsVcK8zfGsh2hXKqJK4xFg'
    }
  };

  try {
    const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
    .then(response => response.json())

    const { results } = data

    const youtubeVideo = results.find(video => video.type === "Trailer")

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

  } catch (error) {
    console.log(error)
  }
  
}

function createMovieLayout({
  id,
  title,
  stars,
  image,
  time,
  year
}) {
  return `
  <div class="movie">
    <div class="title">
      <span>${title}</span>

      <div>
        <img src="./assets/icons/Star.svg" alt="">

        <p>${stars}</p>
      </div>
    </div>

    <div class="poster">
      <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}">
    </div>

    <div class="info">
      <div class="duration">
        <img src="./assets/icons/Clock.svg" alt="">

        <span>${time}</span>
      </div>

      <div class="year">
        <img src="./assets/icons/CalendarBlank.svg" alt="">

        <span>${year}</span>
      </div>
    </div>

    <button onclick="watch(event)" data-id="${id}">
      <img src="./assets/icons/Play.svg" alt="">

      <span>Assistir Trailer</span>
    </button>
  </div>
  `
}

function select3Videos(results) {
  const random = ()=> Math.floor(Math.random() * results.length)

  let selectedVideos = new Set()
  while(selectedVideos.size < 3) {
    selectedVideos.add(results[random()].id)
  }

  return [...selectedVideos]
}

function minutesToHourMinutesAndSeconds(minutes) {
  const date = new Date(null)
  date.setMinutes(minutes)
  return date.toISOString().slice(11, 19)
}

async function start() {
  // pegar as sugestões de filmes da API
  const { results } = await getMovies()
  // pegar randomicamente 3 filmes para sugestão
  const best3 = select3Videos(results).map(async movie => {
    // pegar informações extras do 3 filmes
    const info = await getMoreInfo(movie)

    // organizar os dados para ...
    const props = {
      id: info.id,
      title: info.title,
      stars: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHourMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4)
    }

    return createMovieLayout(props)
  })

  const output = await Promise.all(best3)
  
  
  // substituir o conteúdo dos movies lá no html
  document.querySelector('.movies').innerHTML = output.join("")
}

start()