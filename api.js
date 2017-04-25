(function (global) {
    "use strict";

    var App = global.App || {};
    // var $ = global.jQuery;

    var url = "http://localhost:6060/items";

    Vue.component("phone", {
        template: "#template-item-raw",
        props: ["item"],
        methods: {
            upvotePhone: function (item) {
                item.rating++;
                // $.ajax({
                //     url: "",
                //     type: "PATCH",
                //     data: item
                // });
            },   // send data to the server
            deletePhone: function (item) {
                var index = vm.phones.indexOf(item);
                vm.phones.splice(index, 1);
                // $.ajax({
                //     url: "",
                //     type: "DELETE"
                // });
            }
        }
    });

    var vm = new Vue({
        el: "#app4",
        data: {
            phones: []
        },
        mounted: function () {
            this.$http({url: url, method: 'GET'})
                .then(function (response) {
                    vm.phones = response.body;
                }, function () {
                    console.log("Error handling request");
                });
            // $.get(url, function (data) {
            //     vm.phones = data;
            // });
        }       // get data from the server
    });

    App.vm = vm;
    global.App = App;

})(window);
