const config = require('./config');
const BurritoStore = require('../store/burrito');
const log = require('bog');

module.exports = (() => {
    const dailyCap = config('SLACK_DAILY_CAP');

    function handleMsg(giver, updates) {
        BurritoStore.givenBurritosToday(giver).then((burritos) => {
            log.info('%s has given %d burritos today', giver, burritos.length);

            if (burritos.length >= dailyCap) {
                log.info('Daily cap of %d reached', dailyCap);
                return;
            }

            const a = updates.shift();

            if (a.type === 'inc') {
                BurritoStore.giveBurrito(a.username, giver);
            } else if (a.type === 'dec') {
                BurritoStore.takeAwayBurrito(a.username, giver);
            }
        });
    }

    function storeminator(msg) {
        const { giver, updates } = msg;

        if (updates.length) {
            handleMsg(giver, updates);
        }
    }

    return {
        storeminator,
    };
});
