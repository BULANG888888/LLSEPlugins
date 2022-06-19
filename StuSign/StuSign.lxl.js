/* global mc logger ll JsonConfigFile money Format */
// LiteXLoader Dev Helper
/// <reference path="c:\Users\Administrator\.vscode\extensions\moxicat.llscripthelper-1.0.1\lib/Library/JS/Api.js" />

const config = new JsonConfigFile('plugins/StuSign/config.json');
const minMoney = config.init('minMoney', 500);
const maxMoney = config.init('maxMoney', 2000);
const moneyName = config.init('moneyName', '金币');

const logConf = new JsonConfigFile('plugins/StuSign/log.json');

/**
 * 生成指定区间随机整数
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 进行签到
 * @param {Player} player
 */
function doSign(player) {
  const addMoney = getRandomInt(minMoney, maxMoney);
  money.add(player.xuid, addMoney);

  const { Green, MinecoinGold, Clear, Bold, Yellow, Aqua } = Format;
  const msg =
    `${Green}欢迎回来， ${Bold}${MinecoinGold}${Clear}${Green}~\n` +
    `今日进入游戏签到获取了 ${Bold}${Yellow}${addMoney} ${Clear}${Aqua}${moneyName}${Green}~`;
  player.sendText(msg);
  player.sendText(msg, 5);
}

/**
 * 签到
 * @param {Player} player
 */
function sign(player) {
  const nowDate = new Date(new Date().toLocaleDateString());
  const lastSignDate = new Date(logConf.get(player.realName));
  if (lastSignDate) {
    if (lastSignDate < nowDate) {
      doSign();
    }
  } else {
    doSign(player);
  }
}

mc.listen('onJoin', sign);

ll.registerPlugin('StuSign', '简洁的入服签到插件', [0, 1, 0], {
  Author: 'student_2333',
  License: 'Apache-2.0',
});
logger.info('插件加载成功~');
