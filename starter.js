(function () {
    "use strict";

    var firstDataSet = {
        message: "Received from server.",
        arr: ["One", "Two"],
        arrOfObjs: [{
            writer: "value one",
            plot: "Data one"
        },{
            writer: "value two",
            plot: "Data two"
        }],
        obj: {
            keyOne: "value1",
            keyTwo: "value2"
        },
        votes: 0
    };
    var secondDataSet = {
        a: null,
        b: null,
        operator: "+",
        c: null
    };
    var thirdDataSet = {
        candidates: [
            {name: "Mr. Black", votes: 0},
            {name: "Mr. White", votes: 0},
            {name: "Mr. Green", votes: 0},
            {name: "Mr. Red", votes: 0}]
    };
    var fourthDataSet = {
        query: "",
        stories: [
            {
                plot: "First story",
                writer: "First writer",
                upvotes: 2,
                voted: false
            },
            {
                plot: "Second story",
                writer: "Second writer",
                upvotes: 8,
                voted: false
            },
            {
                plot: "Third story",
                writer: "First writer",
                upvotes: 5,
                voted: false
            },
            {
                plot: "Fourth story",
                writer: "Second writer",
                upvotes: 74,
                voted: false
            }],
        favorite: {},
        heroes: [
            {
                name: "First Name", last: "First Last Name", secretId: "First ID"
            },
            {
                name: "Second Name", last: "Second Last Name", secretId: "Second ID"
            },
            {
                name: "Third Name", last: "Third Last Name", secretId: "Third ID"
            },
            {
                name: "Fourth Name", last: "Fourth Last Name", secretId: "Fourth ID"
            }],
        stash: [
            {name: "One", data: "Data One"},
            {name: "Two", data: "Data Two"},
            {name: "Three", data: "Data Three"}]
    };
    var customEventsData = {
        votes: 0
    };

    function upVoteMethod() {
        this.firstDataSet.votes++;
    }
    function calc() {
        switch (this.secondDataSet.operator) {
            case "+":
                this.secondDataSet.c = this.secondDataSet.a + this.secondDataSet.b;
                return;
            case "-":
                this.secondDataSet.c = this.secondDataSet.a - this.secondDataSet.b;
                return;
            case "*":
                this.secondDataSet.c = this.secondDataSet.a * this.secondDataSet.b;
                return;
            case "/":
                this.secondDataSet.c = this.secondDataSet.a / this.secondDataSet.b;
                return;
        }
    }
    function mayorVote(candidate) {
        return candidate.votes++;
    }
    function clearResults() {
        this.thirdDataSet.candidates = this.thirdDataSet.candidates.map(function (candidate) {
            candidate.votes = 0;
            return candidate;
        })
    }
    function storiesBy(writer) {
        return this.fourthDataSet.stories.filter(function (story) {
            return story.writer === writer;
        });
    }
    function customEventsMethodOne(argName) {
        this.$emit('voted', argName);
    }       // emit custom event and pass arg

    Vue.filter('snitch', function (hero) {
        return hero.secretId + ' is '
            + hero.name + ' '
            + hero.last;
    });

    Vue.component('story', {
        template: "#story-template",
        props: ['propNameOne'],     // props that will be used in template, should be v-bind with data obj
        methods: {
            upvote: function () {
                this.propNameOne.upvotes += 1;
                this.propNameOne.voted = true;
            },
            setFavorite: function () {
                fourthDataSet.favorite = this.propNameOne;
            }
        },
        computed: {
            isFavorite: function () {
                return this.propNameOne == fourthDataSet.favorite;
            }
        }
    });

    new Vue({
        el: "#app",
        data: {
            firstDataSet: firstDataSet,
            secondDataSet: secondDataSet,
            thirdDataSet: thirdDataSet,
            fourthDataSet: fourthDataSet,
            customEventsData: customEventsData
        },
        methods: {
            upVote: upVoteMethod,
            calc: calc,
            mayorVote: mayorVote,
            clearResults: clearResults,
            storiesBy: storiesBy,
            customEventsMethodOne: customEventsMethodOne
        },
        computed: {
            mayor: function () {
                var candidatesSorted = this.thirdDataSet.candidates.sort(function (a, b) {
                    return b.votes - a.votes;
                });
                return candidatesSorted[0];
            },
            famous: function () {
                return this.fourthDataSet.stories.filter(function (item) {
                    return item.upvotes > 25;
                });
            },
            search: function () {
                var query = this.fourthDataSet.query;
                return this.fourthDataSet.stories.filter(function (item) {
                    return item.plot.includes(query);
                });
            },

        },
        created: function () {
            this.$on('voted', function (argName) {
                this.customEventsData.votes++;
            });     // register for the custom event
        },       // lifecycle hook, called synchronously after the instance is created
        beforeMount: function () {
            // logic
        },      // lifecycle hook, called right before the mounting begins
        beforeUpdate: function () {
            // logic
        }       // lifecycle hook, called each time when the data changes
    });

})();
