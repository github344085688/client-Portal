
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./googleMap.vue";
import { forEach, map, partialRight, pick, values, mapKeys, isArray, head, flattenDeep, zipObject, keys, } from 'lodash-es';

@Component({
  mixins: [template],
})
export default class GoogleMaps extends WiseVue {
    @Prop({
        default: {
            lat: 33.922112,
            lng: -118.263168,
        }
    })
    centerLocation!: any;

    @Prop({default: "420px"})
    height!: string;

    @Prop({default: []})
    locations!: Array<any>;

    center: any = {
        lat: 33.922112,
        lng: -118.263168
    };
    map!: google.maps.Map;
    positionsMarkers: Array<any> = [];
    markers: google.maps.Marker[] = [];
    flightPath!: google.maps.Polyline;
    flightPaths: google.maps.Polyline[] = [];
    paths: Array<any> = [];
    polylines: Array<any> = [];
    directionsService!: google.maps.DirectionsService;
    stepDisplay!: google.maps.InfoWindow;
    newBoundary!: google.maps.LatLngBounds;
    directionsRenderer!: google.maps.DirectionsRenderer;
    geocoder!: google.maps.Geocoder;
    origin: any = '';
    destination: any = '';
    gisCenterLocation: any = '';

    @Watch('centerLocation', {deep: true})
    getCenterLocation(val: any) {
        this.gisCenterLocation = {
            lat: Number(val['location_lat']),
            lng: Number(val['location_lng']),
        };
    }

    @Watch('locations')
    getmarkers(val: any, oldVal: any) {
        if (val) {
            if (!this.isNoOriginAndDestination(val)) {
                this.clearMarkers();
                this.clearFlightPath();
                this.map.setCenter({
                    lat: 33.922112,
                    lng: -118.263168,
                });
                if (this.directionsRenderer && this.directionsRenderer != undefined) {
                    this.directionsRenderer.setMap(null);
                }
                return;
            }
            this.positionsMarkers = flattenDeep(val);
            let headMap = head(this.locations);
            this.paths = [];
            if (isArray(headMap)) {
                forEach(this.locations, (location, key) => {
                    this.paths.push({
                        ['polylines' + key]: map(location, partialRight(pick, ['lat', 'lng']))
                    });
                });
            }
            else {
                this.paths.push({
                    'polylines0': map(val, partialRight(pick, ['lat', 'lng']))
                });
            }

            this.updateMap(this.center);
        }
        else this.polylines = [];
    }

    created() {
    }

    mounted() {
        this.initMap();
    }

    initMap(): void {
        this.map = new google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
                zoom: 10,
                center:  { lat: 33.922112,
                    lng: -118.263168, },
                streetViewControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: ["roadmap"],
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                },
                styles: [
                    {elementType: "geometry", stylers: [{color: "#2e2e2e"}]},
                    {elementType: "labels.text.stroke", stylers: [{color: "#2e2e2e"}]},
                    {elementType: "labels.text.fill", stylers: [{color: "#383838"}]},
                    {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{color: "#696969"}],
                    },
                    {
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#212121"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#757575"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#212121"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#757575"
                            },
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.country",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#9e9e9e"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.locality",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#bdbdbd"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#757575"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#181818"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#616161"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#1b1b1b"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#2c2c2c"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#8a8a8a"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#373737"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#3c3c3c"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#4e4e4e"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#616161"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#757575"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#17263c"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#17263c"
                            }
                        ]
                    }
                ],
            }
        );
        this.directionsService = new google.maps.DirectionsService();
        this.stepDisplay = new google.maps.InfoWindow();
        this.newBoundary = new google.maps.LatLngBounds();
        this.geocoder = new google.maps.Geocoder();
    }

    private isNoOriginAndDestination(locations: any) {
        this.origin = '';
        this.destination = '';
        locations.forEach((i: any) => {
            if (i['state'] == 'trailer' && i['lat'] && i['lng'] && i['lat'] != 0 && i['lng'] != 0) this.origin = {lat: i['lat'], lng: i['lng']};
            if (i['state'] == 'tractor' && i['lat'] && i['lng'] && i['lat'] != 0 && i['lng'] != 0) this.destination = {
                lat: i['lat'],
                lng: i['lng']
            };
        });
        if (!this.origin || !this.destination) {
            this.clearMarkers();
            this.clearFlightPath();
            return false;
        } else {
            this.center = this.origin;
            return true;
        }
    }

    private svgMarker(state: string) {
        if (state == 'tractor') return {
            path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
            strokeColor: "#c92c32",
            fillColor: "#ff3900",
            fillOpacity: 1,
            strokeWeight: 1,
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(10, 10),
        };

        if (state == 'trailer') return {
            path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
            strokeColor: "#1e9bdb",
            fillColor: "#23b5ff",
            fillOpacity: 1,
            strokeWeight: 1,
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(10, 10),
        };
    }

    private setMarkers(): void {
        this.positionsMarkers.forEach((i: any) => {
            const marker = new google.maps.Marker({
                position: {lat: i['lat'], lng: i['lng']},
                icon: this.svgMarker(i['state']),
                title: (i['state'] + " : " + i['title']),
                map: this.map,
                zIndex: 1000,
            });
            this.markers.push(marker);
        });

        forEach(this.markers, (marker: any) => {
            google.maps.event.addListener(marker, "click", (e: any) => {
                console.log(marker.getPosition());
                this.geocoder.geocode({'location': marker.getPosition()}, (results, status) => {
                    if (status == 'OK') {
                        this.stepDisplay.setContent('<div><h4>' + marker.getTitle() + '</h4></div>' + results[0]['formatted_address']);
                        this.stepDisplay.open(this.map, marker);
                    } else {
                        this.stepDisplay.setContent('<div><h4>' + marker.getTitle() + '</h4></div>');
                        this.stepDisplay.open(this.map, marker);
                    }
                });
            });
        });
    }

    updateMap(panTo: any) {
        this.clearMarkers();
        this.clearFlightPath();
        this.setMarkers();
        if (this.gisCenterLocation['location_lat'] != 0 && this.gisCenterLocation['location_lat'] != 0) {
            this.panTo(this.gisCenterLocation);
            const CenterMarker = new google.maps.Marker({
                position: this.gisCenterLocation,
                icon: this.svgCenterMarker(),
                title: this.centerLocation['location_code'] + this.centerLocation['location_state'],
                map: this.map,
                zIndex: 10000,
            });
            this.markers.push(CenterMarker);
        }
    }

    private panTo(panTo: any) {
        this.map.setCenter( panTo);
        this.map.setZoom(10);
        this.map.panTo(panTo);
    }
    private  svgCenterMarker() {
        return {
            path: "M13.3,36.3l9.4-19h0c1-1.7,1.5-3.6,1.5-5.7C24.3,5.1,19.1,0,12.8,0C6.5,0,1.3,5.1,1.3,11.5c0,2.1,0.6,4,1.5,5.7h0l9.4,19 C5.4,36.3,0,37.7,0,39.5c0,1.8,5.7,3.2,12.8,3.2c7.1,0,12.8-1.4,12.8-3.2c0,0,0,0,0,0C25.6,37.7,20.1,36.3,13.3,36.3z M7.1,11.5 c0-3.2,2.6-5.7,5.7-5.7c3.2,0,5.7,2.6,5.7,5.7s-2.6,5.7-5.7,5.7S7.1,14.7,7.1,11.5z",
            strokeColor: "#00c977",
            fillColor: "#00c977",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(5, 5),
        };
    }

    private clearFlightPath(): void {
        for (let i = 0; i < this.flightPaths.length; i++) {
            this.flightPaths[i].setMap(null);
        }
        this.flightPaths = [];
    }

    private clearMarkers(): void {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }
}