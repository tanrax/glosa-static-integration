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
    computed: {
        commentsParent: function() {
            return this.comments.filter(item => item.parent === undefined);
        },
        commentsSortWithChilds: function() {
            return this.commentsParent.map(item => [].concat(item, this.getCommentsChilds(item.id))).flat();
        }
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
        getCommentsChilds: function (parent) {
            return this.comments.filter(item => item.parent === parent);
        },
        getURL: function () {
            return 'https://programadorwebvalencia.com/cual-es-el-mejor-navegador-web-2020/';
        },
        formatDate: function (unixtime) {
            const DATE = new Date(unixtime * 1000);
            return `${DATE.getDate()}/${DATE.getMonth() + 1}/${DATE.getFullYear()}`;
        },
        filterHTMLTags: function (text) {
            let myElement = document.createElement('div');
            myElement.innerHTML = text;
            return myElement.textContent;
        },
        openNewComment: function (parent = '') {
            this.showNewComment = true;
            console.log(parent)
        }
    }
});
