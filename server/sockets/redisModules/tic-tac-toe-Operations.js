const util = require("util");
module.exports = function (main_client) {
  return {
    async handleEnemyReadiness(roomId, reset = false) {
      let zscore_prom = util.promisify(main_client.zscore).bind(main_client);
      if (reset) {
        console.log("Resetting readiness");
        await main_client.zrem("playersReady", `${roomId}`);
        return false;
      }
      if ((await zscore_prom("playersReady", roomId)) === null) {
        console.log("adding room to playing");
        main_client.zadd("playersReady", 1, roomId);
        return false;
      } else {
        main_client.zincrby("playersReady", 1, roomId);
        console.log(await zscore_prom("playersReady", roomId));
        console.log("room:" + roomId);
        return true;
      }
    },
    async handleSendPeopleInRoom(roomId) {
      let zrange_prom = util.promisify(main_client.zrange).bind(main_client);
      return await zrange_prom(`room:${roomId}`, "-1000", "+1000");
    },
    handleSignSet() {
      if (Math.random() >= 0.5) {
        return ["o", "x"];
      } else {
        return ["x", "o"];
      }
    },
    readinessReset(roomId) {
      main_client.zrem("playersReady", roomId);
    },
  };
};
