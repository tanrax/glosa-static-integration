const URL_API = 'http://programadorwebvalencia.localhost:4000/api/v1';
const ENDPOINT_COMMENTS_API = '/comments/';

Vue.component('comment', {
    props: {
        id: Number,
        comments: Object
    },
    template: document.querySelector('template#comment').innerHTML,
    computed: {
        fields: function () {
            return R.head(R.filter((item) => item.id === this.id, this.comments));
        },
        childs: function () {
            return R.filter(item => item.parent === this.id, this.comments);
        }
    },
    methods: {
        formatDate: function (unixtime) {
            const DATE = new Date(unixtime * 1000);
            return `${DATE.getDate()}/${DATE.getMonth() + 1}/${DATE.getFullYear()}`;
        },
        filterHTMLTags: function (text) {
            let myElement = document.createElement('div');
            myElement.innerHTML = text;
            return myElement.textContent;
        }
    }
});

new Vue({
    el: '#app-comments',
    data: {
        comments: [],
        showNewComment: false,
        maxDeep: 4
    },
    mounted: function () {
        this.getComments();
    },
    computed: {
        commentsParent: function () {
            return R.filter(item => item.deep === 0, this.comments);
        },
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
        getCommentsChilds: function (id) {
            return R.filter(item => item.parent === id, this.comments);
        },
        getSingleComment: function (id) {
            return R.head(R.filter((item) => item.id === id, this.comments));
        },
        getURL: function () {
            return 'https://programadorwebvalencia.com/cual-es-el-mejor-navegador-web-2020/';
        },
        openNewComment: function (parent = '') {
            this.showNewComment = true;
            console.log(parent);

        }
    }
});
