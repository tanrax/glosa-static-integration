const URL_API = 'http://programadorwebvalencia.localhost:4000/api/v1';
const ENDPOINT_COMMENTS_API = '/comments/';

new Vue({
    el: '#app-comments',
    data: {
        comments: [],
        showNewComment: false,
        parents: [],
        maxDeep: 4
    },
    mounted: function () {
        this.getComments();
    },
    computed: {
        commentsSortWithChilds: function() {
            return this.comments.filter(item => this.getDeep(item.id) === 0).map(item => [].concat(item, this.getCommentsChilds(item.id, 1))).flat();
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
        getCommentsChilds: function (parent, deep) {
            return this.comments.filter(item => item.parent === parent);
        },
        getSingleComment: function (id) {
            return R.head(R.filter((item) => item.id === id, this.comments));
        },
        getDeep: function (id) {
            // Get commet by id
            const COMMENT = this.getSingleComment(id);
            if (!R.isNil(COMMENT)) {
                // Parent
                if (R.isNil(COMMENT.parent)) {
                    // Count deep
                    const totalDeep = R.length(this.parents);
                    // Reset parents
                    this.parents = [];
                    // Return deep
                    return totalDeep;
                } else {
                    // Calculate deep
                    //// Add id to parents
                    this.parents = R.append(id, this.parents);
                    //// Search next parent
                    return this.getDeep(COMMENT.parent);
                }
            }
            return undefined;
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
            console.log(parent);
        }
    }
});
