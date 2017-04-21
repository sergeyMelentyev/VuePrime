(function () {
    "use strict";
    var data = {
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
    function upVoteMethod() {
        this.votes++;
    }
    new Vue({
        el: "#app",
        data: data,
        methods: {
            upVote: upVoteMethod
        }
    });

})();
