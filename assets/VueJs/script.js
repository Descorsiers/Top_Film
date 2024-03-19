

Vue.component('form-select', {
  template: `
    <div class="container p-5">
      <h1 class="text-center p-3" v-if="!end">Tier list de film</h1>
      <h2 class="text-center p-3 h1" v-if="end">Votre top 10</h2>
        <select class="form-select" aria-label="Default select example" @change='top_movies' v-if="!end">
            <option selected disabled>CHOIX GENRE</option>
            <option :value='genre.id' v-for='genre in list_genre'>{{genre.name}}</option>
        </select>
        <div  class="text-center container-fluid-sm container-md pt-4" v-if="!end">
        <ol style="width: 100%;" >
            <draggable v-model="movieOrder">
              <li v-for='movie in movieOrder' class="list-inline-item p-1 text-center" style="max-width: 17%;">
                <img :src='movie' style="width: 100%;" :alt="movie.title">
              </li>
            </draggable>
        </ol>       
        </div>
        <div  class="text-center pt-4" v-if="end">
        <ol class="w-100">
            <li v-for='movie in movieOrder' class="list-inline-item p-1 text-center" style="max-width: 17%;">
                <img :src='movie' class="w-100" :alt="movie.title">
            </li>
        </ol>       
        </div>
        <div class="text-center" v-if='toggle'>
        <button type="button" class="btn btn-outline-primary w-50 mt-4" @click="affichList()">Terminer le vote</button>
        </div>
        <div class="text-center" v-if='newer'>
        <button type="button" class="btn btn-outline-primary w-50 mt-4" @click="changeVote()">Changer vote</button>
        </div>
        <div class="text-center" v-if='newer'>
        <button type="button" class="btn btn-outline-primary w-50 mt-4" @click="restart()">Recommencer</button>
        </div>
    </div>`,

  // <ol>
  //     <li v-for='movie in movies' :key='movie.id' >{{movie.title}}</li>
  // </ol>
  data: function () {
    return {
      list_genre: [],
      name_genre: '',
      movies: [],
      movieOrder: [],
      poster: 'https://image.tmdb.org/t/p/w500',
      toggle: false,
      end: false,
      newer: false,
    }
  },
  created: function () {

    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/genre/movie/list',
      params: { language: 'fr' },
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmJjMjhiNDFjNjE2N2U4YWNmMDc4Mjk1NTJmM2MxNyIsInN1YiI6IjY1ZjdmYmU0NTkwN2RlMDE3Y2U4N2Y4MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oK03zF2GW35bBfsVK-eQnwGF9yU6RlBlrS4Ll2M8hXQ'
      }
    };
    axios
      .request(options)
      .then(response => {
        this.list_genre = response.data.genres;
      })
      .catch(function (error) {
        console.error(error);
      });
  },
  methods: {
    top_movies(e) {
      this.movies = [];
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/discover/movie',
        params: {
          include_adult: 'false',
          include_video: 'false',
          language: 'fr-FR',
          page: '1',
          sort_by: 'vote_count.desc',
          with_genres: e.target.value,
          vote_count_gte: 300

        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmJjMjhiNDFjNjE2N2U4YWNmMDc4Mjk1NTJmM2MxNyIsInN1YiI6IjY1ZjdmYmU0NTkwN2RlMDE3Y2U4N2Y4MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oK03zF2GW35bBfsVK-eQnwGF9yU6RlBlrS4Ll2M8hXQ'
        }
      };

      axios
        .request(options)
        .then((response) => {
          this.movies = response.data.results.slice(0, 10);
          console.log(this.movies);
          this.toggle = true;
          this.movieOrder = this.movies.map((x) => this.poster + x.poster_path)
        })
        .catch((error) => {
          console.error(error);
        });
    },
    affichList(){
      this.end = true;
      this.toggle = false;
      this.newer = true;
    },
    restart(){
      localStorage.setItem("Top",this.movieOrder);
      localStorage.clear();
      localStorage.getItem('Top');
      location.reload();
    },
    changeVote(){
      this.end = false;
      this.newer = false;
      this.toggle = true;
    }
  }
});



let app = new Vue({
  el: '#app',
  data: {
    
  },

})