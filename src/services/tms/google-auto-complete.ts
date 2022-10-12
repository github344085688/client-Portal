import BaseService from "./_tms-base-service";
 export default class GoogleAutoComplete extends BaseService  {

    private componentForm: any = {
        street_number: "long_name",
        route: "long_name",
        locality: "long_name", // city
        administrative_area_level_1: "long_name", // state
        country: "long_name",
        postal_code: "long_name"
    };

    private options = {
        types: ["(regions)"],
        componentRestrictions: { country: ["us"] }
    };

    searchResult(input: any) {
        let result: any = {
            street_number: null,
            route: null,
            locality: null,
            administrative_area_level_1: null,
            country: null,
            postal_code: null,
        };

        let promise = new Promise((resolve, reject) => {
        let autoComplete2 = new google.maps.places.Autocomplete(input, this.options);
            google.maps.event.addListener(autoComplete2, 'place_changed', () => {
                let place = autoComplete2.getPlace();
                if (place) {
                    let address_components = place['address_components'] || [];
                    address_components.forEach(item => {
                        let addressType = item.types[0];
                        if (this.componentForm[addressType]) {
                            result[addressType] = item.short_name;
                        }
                    });
                }
                let locationData = {
                    city: result.locality,
                    state: result.administrative_area_level_1,
                    country: result.country,
                    postal_code: result.postal_code
                };
                resolve(locationData);
            });
        });

        return promise;
    }

}