let { getDataByUserID } = require('../../libs/data/something.js');

let getAdminMenu = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let practice = await getDataByUserID(messenger_user_id);

  let block_name = (practice && practice.fields['Active?']) ? 'Admin Menu' : 'Non Admin';

  let redirect_to_blocks = [block_name];

  res.send({ redirect_to_blocks });
}

module.exports = getAdminMenu;