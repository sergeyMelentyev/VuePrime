(function () {
    "use strict";

    var bus = new Vue();

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
                var food = event.srcElement.textContent;
                this.votes++;
                bus.$emit('voted', food);
            },
            reset: function () {
                this.votes = 0;
            }
        },
        created: function () {
            bus.$on('reset', this.reset);
        }
    });

    new Vue({
        el: '#app2',
        data: {
            votes: {
                count: 0,
                log: []
            }
        },
        methods: {
            countVote: function (food) {
                this.votes.count++;
                this.votes.log.push(food);
            },
            reset: function () {
                this.votes = {
                    count: 0,
                    log: []
                };
            }
        },
        created: function () {
            bus.$on('voted', this.countVote);
        }
    });
})();
