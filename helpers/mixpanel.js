const mp = require('mixpanel');

class Mixpanel {
    constructor(mixtoken, distinctId){
        this.mixpanel = mp.init(mixtoken, {
            // protocol: 'https'
        });
        this.distinctId = distinctId;
    }

    trackFBSignUp(first_name, last_name){
        
        this.mixpanel.track('FBSignUp', {
            distinct_id: this.distinctId,
            first_name,
            last_name,
            created: (new Date()).toISOString(),
        });
    }
}

module.exports = Mixpanel;