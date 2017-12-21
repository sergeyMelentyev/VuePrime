<template>
    <div></div>
</template>

<script>
    export default {
        props: {
            "stores": {
                type: Array
            }
        },
        computed: {
            sortedByMetro() {
                if (!(this.stores && this.stores.length)) return void 0;
                const temp = Array.from(Object.create(this.stores));
                return temp.sort((a,b) => {
                    const elFirst = a.stations && a.stations.length && a.stations[0].line.name;
                    const elSecond = b.stations && b.stations.length && b.stations[0].line.name;
                    if (elFirst === elSecond) return 0;
                    else return elFirst > elSecond ? 1 : -1;
                });
            },
            sortedByAvailable() {
                if (!(this.stores && this.stores.length)) return void 0;
                const temp = Array.from(Object.create(this.stores));
                return temp.sort((a,b) => {
                    if (a.availability == b.availability) return 0;
                    else return a.availability > b.availability ? 1 : -1;
                });
            }
        }
    };
</script>
