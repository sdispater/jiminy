Template.seasonsItem.helpers({
    episodes: function() {
        return Episodes.find({season_id: this._id}, {sort: {number: -1}});
    }
});

Template.seasonsItem.rendered = function(){
    $('.tip').tooltip();
}
