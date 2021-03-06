let { getPersonByMessengerID, updatePerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let createProfile = async ({ query }, res) => {
  let {
    messenger_user_id,
    first_name,
    last_name,
    gender,
    zip_code,
    latitude,
    longitude,
    messenger_link,
    profile_image,
    is_runner,
    is_cyclist,
    is_gymnist,
    phone_number,
    gender_match
  } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (person && person.fields.length > 1) {
    let redirect_to_blocks = ['Profile Already Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let activities = [
    is_runner.toUpperCase() === 'YES' ? 'Running' : null,
    is_cyclist.toUpperCase() === 'YES' ? 'Cycling' : null,
    is_gymnist.toUpperCase() === 'YES' ? 'Gym' : null,
  ].filter(Boolean);

  let new_person_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender.toLowerCase(),
    ['Match By Gender']: gender_match.toLowerCase(),
    ['Activities']: activities,
    ['Phone Number']: phone_number,
    ['Zip Code']: zip_code,
    ['Latitude']: Number(latitude),
    ['Longitude']: Number(longitude),
    ['Messenger Link']: messenger_link,
    ['Profile Image URL']: profile_image,
  }

  let new_person = await updatePerson(new_person_data, person);

  let redirect_to_blocks = ['New Profile Created'];

  res.send({ redirect_to_blocks });
}

module.exports = createProfile;