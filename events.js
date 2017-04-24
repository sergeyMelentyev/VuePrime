(function () {
    "use strict";

    Vue.component('food', {
        template: '#food',
        props: ['name'],
        data: function () {
            return {
                votes: 0
            };
        },
        methods: {
            vote: function (event) {
                this.votes++;
                this.$emit('voted', event.srcElement.textContent);
            }
        }
    });

    new Vue({
        el: '#app2',
        data: {
            votes: 0,
            log: []
        },
        methods: {
            countVote: function (data) {
                this.votes++;
                this.log.push(data);
            }
        }
    });
})();
