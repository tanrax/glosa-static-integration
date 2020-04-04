const URL_API = 'localhost:4000/api/v1/comments/';

new Vue({
    el: '#app-comments',
    data: {
        comments: [],
        total: 0,
        showNewComment: false
    },
    mounted: function () {
        this.getComments();
    },
    methods: {
        getComments: function () {
            axios.get()
        }
    }
});
