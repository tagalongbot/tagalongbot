let { BASEURL } = process.env;

let { createURL } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getPromo = async ({ practice_base_id, promo_id }) => {
  let promosTable = getPromosTable(practice_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let updatePromo = async ({ practice_base_id, promo }) => {
  let promosTable = getPromosTable(practice_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let updateData = {
    ['Active?']: promo.fields['Active?'] ? false : true
  }
  
  let updated_promo = await updatePromoFromTable(updateData, promo);
  return updated_promo;
}

let createUpdateMsg = (data) => {
  let { messenger_user_id, promo_id, practice_base_id, promo, updatedPromo } = data;
  
  let toggle_promo_url = createURL(
    `${BASEURL}/admin/promos/toggle`,
    { promo_id, practice_base_id }
  );

  let view_promo_details_url = createURL(
    `${BASEURL}/admin/promos/view/info`,
    { messenger_user_id, promo_id, practice_base_id }
  );

  let view_all_promos_url = createURL(
    `${BASEURL}/admin/promos/view/all`,
    { messenger_user_id }
  );

  let txtMsg = createButtonMessage(
    `The promo "${promo.fields['Promotion Name']}" is now "${updatedPromo.fields['Active?'] ? 'Active' : 'Deactivated'}"`,
    `${updatedPromo.fields['Active?'] ? 'Deactivate' : 'Reactivate'}|json_plugin_url|${toggle_promo_url}`,
    `View Promo Details|json_plugin_url|${view_promo_details_url}`,
    `View All Promotions|json_plugin_url|${view_all_promos_url}`
  );

  return txtMsg;
}

module.exports = {
  getPromo,
  updatePromo,
  createUpdateMsg,
}