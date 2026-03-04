import cityTimezones from 'city-timezones';
import moment from 'moment-timezone';

export function generateTimezones() {
  const zones = moment.tz.names();
  const zoneMap = {};

  zones.forEach((zone) => {
    const cities = cityTimezones.cityMapping
      .filter((c) => c.timezone === zone)
      .slice(0, 5);
    if (cities.length) {
      const countries = {};
      cities.forEach((c) => {
        if (!countries[c.country]) countries[c.country] = [];
        if (countries[c.country].length < 10) {
          countries[c.country].push(c.city);
        }
      });
      zoneMap[zone] = Object.entries(countries).map(([country, cityArr]) => ({
        country,
        cities: cityArr,
      }));
    }
  });

  const array = Object.entries(zoneMap).map(([zone, countries]) => ({
    timezone: zone,
    countries,
  }));

  const output = [];
  array.forEach((item) => {
    item.countries.forEach((element) => {
      const resItem = {
        timezone: item.timezone,
        country: element.country,
        cities: element.cities,
      };
      output.push(resItem);
    });
  });

  console.log('====================================');
  console.log(output);
  console.log('====================================');
}
