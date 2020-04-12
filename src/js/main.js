const URL_API = 'http://programadorwebvalencia.localhost:4000/api/v1';
const ENDPOINT_COMMENTS_API = '/comments/';

/**
  * Vue APP
 **/
let app = new Vue({
    el: '#app-comments',
    data: {
        comments: [],
        showNewComment: false,
        reply: undefined
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
        getURL: function () {
            return 'https://programadorwebvalencia.com/cual-es-el-mejor-navegador-web-2020/';
        },
        openNewComment: function (id = undefined) {
            this.reply = id;
            this.showNewComment = true;
        }
    }
});

/**
 * Vue component: comment
 **/
Vue.component('comment', {
    props: {
        id: Number,
        comments: Object
    },
    data: function () {
        return {
            maxDeep: 4,
            maxLengthAuthor: 15
        };
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
        formatEllipsisAuthor: function (text) {
            return text.length > this.maxLengthAuthor ? `${text.slice(0, this.maxLengthAuthor - 3)}...` : text;
        },
        filterHTMLTags: function (text) {
            let myElement = document.createElement('div');
            myElement.innerHTML = text;
            return myElement.textContent;
        },
        openReply: function (id) {
            app.openNewComment(id);
        }
    }
});
