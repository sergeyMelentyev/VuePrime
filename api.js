(function (global) {
    "use strict";
    var App = global.App || {};
    var url = "http://localhost:6060/items";
    Vue.component("phone", {
        template: "#template-item-raw",
        props: ["item"],
        methods: {
            editMode: function (item) {
                var index = vm.phones.indexOf(item);
                this.$parent.phones[index].editing = true;
            },
            upvotePhone: function (item) {
                item.rating++;
                this.$http.patch("", item);
                // $.ajax({
                //     url: "",
                //     type: "PATCH",
                //     data: item
                // });
            },   // send data to the server
            deletePhone: function (item) {
                var index = vm.phones.indexOf(item);
                this.$parent.phones.splice(index, 1);
                // vm.phones.splice(index, 1);     // the same as above
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
            phones: [],
            pagination: {}
        },
        mounted: function () {
            this.fetchData();
        },
        methods: {
            fetchData: function (page_url) {
                var page = page_url || url;
                this.$http({url: page, method: 'GET'})
                    .then(function (response) {
                        var phoneReady = response.data.data.map(function (item) {
                            item.editing = false;
                            return item;
                        });
                        vm.makePagination(response.data);
                        Vue.set(vm, "phones", phoneReady);
                    }, function () {
                        console.log("Error handling request");
                    });
            },
            makePagination: function (data) {
                var pagination = {
                    current_page: data.currant_page,
                    last_page: data.last_page,
                    next_page_url: data.next_page_url,
                    prev_page_url: data.prev_page_url
                };
                Vue.set(vm, "pagination", pagination);
            }
        }
    });

    App.vm = vm;
    global.App = App;
})(window);

/*
 // var $ = global.jQuery;
 // $.get(url, function (data) {
 //     vm.phones = data;
 // });
 */
