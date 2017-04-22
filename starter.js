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

    new Vue({
        el: "#app",
        data: {
            firstDataSet: firstDataSet,
            secondDataSet: secondDataSet,
            thirdDataSet: thirdDataSet
        },
        methods: {
            upVote: upVoteMethod,
            calc: calc,
            mayorVote: mayorVote,
            clearResults: clearResults
        },
        computed: {
            mayor: function () {
                var candidatesSorted = this.thirdDataSet.candidates.sort(function (a, b) {
                    return b.votes - a.votes;
                });
                return candidatesSorted[0];
            }
        }
    });

})();
