Template.showsSearchItem.helpers({
    seasonsCount: function() {
        if (!this.seasons || this.seasons.length == 0) {
            return 0;
        }

        return this.seasons.length;
    },
    seasons: function() {
        return this.seasons.sort(function (a, b) {
            if (a.season > b.season) {
                return -1
            }

            if (a.season < b.season) {
                return 1
            }

            return 0;
        });
    }
})
