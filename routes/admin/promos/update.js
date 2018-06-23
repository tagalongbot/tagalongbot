let handleRoute = require('../../../middlewares/handleRoute.js');

let { getPracticePromo } = require('../../../libs/data/practice/promos.js');
let { createExpirationDate } = require('../../../libs/admin/promos/create.js');
let { localizeDate } = require('../../../libs/helpers.js');
let { updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/update.js');

let express = require('express');
let router = express.Router();

let getUpdateField = async ({ query }, res) => {
  let { promo_id, provider_base_id } = query;

  let updating_promo_id = promo_id;
  let updating_provider_base_id = provider_base_id;

  let set_attributes = { updating_promo_id, updating_provider_base_id };
  let redirect_to_blocks = ['Update Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let updateExpirationDate = async ({ query }, res) => {
  let { update_promo_field_value } = query;
  console.log('update_promo_field_value', update_promo_field_value);

  let new_value = localizeDate(
    createExpirationDate(update_promo_field_value)
  );
  
  console.log('new_value', new_value);

  let set_attributes = { update_promo_field_value: new_value }
  res.send({ set_attributes });
}

let updatePromoInfo = async ({ query }, res) => {
  let { 
    messenger_user_id,
    updating_promo_id,
    updating_provider_base_id,
    update_promo_field_name, 
    update_promo_field_value 
  } = query;

  let promo_id = updating_promo_id;
  let provider_base_id = updating_provider_base_id;

  let promo = await getPracticePromo({ provider_base_id, promo_id });
  let updatedPromo = await updatePromo({ provider_base_id, promo, update_promo_field_name, update_promo_field_value });

  let updateMsg = createUpdateMsg(
    { messenger_user_id, promo_id, provider_base_id, promo, updatedPromo, update_promo_field_name, update_promo_field_value }
  );

  let messages = [updateMsg];
  res.send({ messages });
}

router.get(
  '/', 
  handleRoute(getUpdateField, '[Error] Updating Promo')
);

router.get(
  '/expiration_date',
  handleRoute(updateExpirationDate, '[Error] Updating Promo')
);

router.get(
  '/field', 
  handleRoute(updatePromoInfo, '[Error] Updating Promo')
);

module.exports = router;