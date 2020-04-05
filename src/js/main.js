const URL_API = 'http://programadorwebvalencia.localhost:4000/api/v1';
const ENDPOINT_COMMENTS_API = '/comments/';

new Vue({
    el: '#app-comments',
    data: {
        comments: [],
        showNewComment: false
    },
    mounted: function () {
        this.getComments();
    },
    methods: {
        getComments: function () {
            axios({
                method: 'get',
                url: URL_API + ENDPOINT_COMMENTS_API,
                params: {
                    url: this.getURL()
                }
            })
                .then(response => {
                    this.comments = response.data;
                });
        },
        getURL: function () {
            return 'https://programadorwebvalencia.com/cita-de-la-semana-7/';
        }
    }
});
