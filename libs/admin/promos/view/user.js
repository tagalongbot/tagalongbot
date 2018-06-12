let { BASEURL } = process.env;
let { createMultiGallery } = require('../../../../libs/bots');
let { createURL } = require('../../../../libs/helpers');

let { getTable, getAllDataFromTable } = require('../../../../libs/data');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getUser = async ({ user_messenger_id, provider_base_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  let matched_promos = promos.filter(
    promo => promo.fields['Claimed By Users'].includes(user_id)
  );

  return matched_promos;
}

let createUpdateBtn = (data) => {
  let { provider_base_id, promo_id, user_messenger_id, user_record_id, user_ids } = data;

  if (user_ids.includes(user_record_id)) return null;

  let update_promo_url = createURL(`${BASEURL}/promo/verify/update`, { provider_base_id, promo_id, user_messenger_id });

  let btn = {
    title: 'Mark Promo As Used',
    type: 'json_plugin_url',
    url: update_promo_url,
  }

  return btn;
}

let toGalleryElement = ({ provider_base_id, messenger_user_id, user_messenger_id, user_record_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];
  let user_ids = promo['Promo Used By Users'] || [];

  let data = { provider_base_id, promo_id, user_messenger_id };

  let view_promo_info_url = createURL(`${BASEURL}/promo/info`, data);

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_info_url,
  }

  let buttons = [btn1];

  let btn2 = createUpdateBtn({ user_record_id, user_ids, ...data });
  if (btn2) buttons = [btn1, btn2];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  getUser,
  getUserPromos,
  toGalleryElement,
}