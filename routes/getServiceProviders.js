let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { getServices, getActiveProviders } = require('../libs/data');

let toGalleryElement = (provider) => {
  let title = provider.practice_name.slice(0, 80);
  let subtitle = `${provider.first_name} ${provider.last_name} | ${provider.address}`;
  let image_url = provider.practice_panel_photo_uri;

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getServiceProviders = async ({ query }, res) => {
  let { service_id } = query;
  
  let services = await getServices();
  let service = services
    .filter(service => service.serviceid === Number(service_id));

  let activeProviders = await getActiveProviders();
  
  let matchingProviders = activeProviders.filter((provider) => service.providerid === provider.providerid);
  
  if (!matchingProviders[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = matchedServices.map(toGalleryElement(provider_name));
  let servicesGallery = createGallery(providersGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getServiceProviders;