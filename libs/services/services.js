let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;

let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);

  let subtitle = (surgical_or_non_surgical.toLowerCase() === 'surgical') ? 
    `Surgical Service` :
    `Non Surgical | ${non_surgical_category} | ${service[non_surgical_category]}`.slice(0, 80);

  let image_url = service['Image URL'];

  let view_service_details_btn_url = createURL(
    `${BASEURL}/services/description/yes`,
    { service_id }
  );

  let find_practices_btn_url = createURL(
    `${BASEURL}/services/practices`,
    { service_id }
  );

  let find_promos_btn_url = createURL(
    `${BASEURL}/services/promos`,
    { service_id }
  );

  let btn1 = createBtn(`View Service Details|json_plugin_url|${view_service_details_btn_url}`);
  let btn2 = createBtn(`Find Practices|json_plugin_url|${find_practices_btn_url}`);
  let btn3 = createBtn(`Find Promos|json_plugin_url|${find_promos_btn_url}`);

  let buttons = [btn1, btn2, btn3];

  return { title, subtitle, image_url, buttons};
}

let createSurgicalCategoryElement = () => {
  let title = 'Surgical Procedures';
  let image_url = SURGICAL_SERVICES_IMAGE_URL;

  let surgical_category_btn_url = createURL(
    `${BASEURL}/services/search/surgical`,
  );

  let btn = createBtn(`View Services|json_plugin_url|${surgical_category_btn_url}`);

  let buttons = [btn];

  return { title, image_url, buttons };
}

let createLastGalleryElement = ({ service_type, index }) => {
  let title = 'More Options';
  let new_index = Number(index + 8);

  let load_more_services_url = createURL(
    `${BASEURL}/services/search/${service_type}`, 
    { index: new_index }
  );
  
  let btn1 = createBtn(`Load More Services|json_plugin_url|${load_more_services_url}`);
  let btn2 = createBtn(`Main Menu|show_block|Main Menu`);
  let btn3 = createBtn(`About Bevl Beauty|show_block|AboutBB`);

  let buttons = [btn1, btn2, btn3];

  return { title, buttons };
}

module.exports = {
  toGalleryElement,
  createSurgicalCategoryElement,
  createLastGalleryElement,
}