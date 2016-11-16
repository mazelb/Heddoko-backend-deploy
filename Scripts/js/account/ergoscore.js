$(function () {
    ErgoScore.init();
});

var ErgoScore = {

    init: function () {
        Ajax.post("/api/v1/ergoscore/get").success(this.onGetSuccess);
    },

    createGauge: function (data) {
        $("#gauge").kendoLinearGauge({
            pointer: [{
                value: data.userScore,
                color: "#c30000"
            }, {
                value: data.orgScore,
                margin: 10
            }
            ],

            scale: {
                majorUnit: 10,
                minorUnit: 5,
                min: 0,
                max: 103,
                vertical: true
            }
        });  
    },

    onGetSuccess: function (e) {
        if(e)
        {
            ErgoScore.createGauge(e);
        }
        
    }

};
