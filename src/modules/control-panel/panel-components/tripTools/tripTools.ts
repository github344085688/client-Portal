import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./tripTools.vue";
import ControlPanelService from '@services/control-panel/controlPanelService';
import errorHandler from "@shared/error-handler";
import { MessageBox } from 'element-ui';
import { forEach } from "lodash-es";

@Component({
    mixins: [template],
    name: 'tripTools',
    components: {}
})
export default class TripTools extends Vue {
    @Prop({
        default: function () {
            return {};
        }
    })
    tripDetail!: any;

    selectTools: Array<any> = [true, false, false];

    selectToolsFun(index: any) {
        this.selectTools = [false, false, false];
        this.selectTools[index] = true;
    }

    getTripSummary() {
        ControlPanelService.getTripSummaryPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripManifest() {
        ControlPanelService.getTripManifestPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripMarginPdf() {
        ControlPanelService.getTripMarginPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripMarginExcel() {
        ControlPanelService.getTripMarginExcel(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                const url = this.makeCsv(res, {});
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.tripDetail.trip_no}-MarginExcel.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripLoadSheetPdf() {
        ControlPanelService.getTripLoadSheetPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripDailyManifestPdf() {
        ControlPanelService.getTripDailyManifestPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getTripDrPdf() {
        MessageBox.confirm('Please select side type', 'Side Type', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Doubel Side',
            cancelButtonText: 'Single Side',
            type: 'warning',
            }).then(() => {
                ControlPanelService.getTripDrPdf(this.tripDetail.trip_no, null, 1).subscribe(
                    (res: any) => {
                        this.createScriptToWrite(res);
                    },
                    (err: any) => {
                        errorHandler.handle(err);
                    }
                );
            }).catch((action: any) => {
            if (action != 'close') {
                ControlPanelService.getTripDrPdf(this.tripDetail.trip_no, null, 0).subscribe(
                    (res: any) => {
                        this.createScriptToWrite(res);
                    },
                    (err: any) => {
                        errorHandler.handle(err);
                    }
                );
            }
        });
    }

    getTripDrDeliveryPdf() {
        if (this.judgeDelivery()) {
            MessageBox.confirm('Please select side type', 'Side Type', {
                distinguishCancelAndClose: true,
                confirmButtonText: 'Doubel Side',
                cancelButtonText: 'Single Side',
                type: 'warning',
                }).then(() => {
                    ControlPanelService.getTripDrPdf(this.tripDetail.trip_no, 1, 1).subscribe(
                        (res: any) => {
                            this.createScriptToWrite(res);
                        },
                        (err: any) => {
                            errorHandler.handle(err);
                        }
                    );
                }).catch((action: any) => {
                if (action != 'close') {
                    ControlPanelService.getTripDrPdf(this.tripDetail.trip_no, 1, 0).subscribe(
                        (res: any) => {
                            this.createScriptToWrite(res);
                        },
                        (err: any) => {
                            errorHandler.handle(err);
                        }
                    );
                }
            });
        } else {
            errorHandler.handle('Trip without delivery');
        }
    }

    getTripCarrierBolPdf() {
        ControlPanelService.getTripCarrierBolPdf(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    refreshTrip() {
        this.$emit('refreshTrip', true);
    }

    makeTripIncomplete() {
        ControlPanelService.makeTripIncomplete(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                MessageBox.alert(`Incomplete ${this.tripDetail.trip_no} success.`, 'Incomplete Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: true,
                            trip: true
                        });
                    }
                });
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    makeTripComplete() {
        ControlPanelService.makeTripComplete(this.tripDetail.trip_no).subscribe(
            (res: any) => {
                MessageBox.alert(`Complete ${this.tripDetail.trip_no} success.`, 'Complete Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: true,
                            trip: true
                        });
                    }
                });
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    judgeDelivery() {
        let canDelivery = false;
        forEach(this.tripDetail.tasks, (task, taskIndex) => {
            forEach(task.stops, (stop, stopIndex) => {
                if (stop.stage == '2') {
                    canDelivery = true;
                    return canDelivery;
                }
            });
        });
        return canDelivery;
    }

    createScriptToWrite(res: string) {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        let scriptTxt = res.replace('<script>', '').replace('</script>', '');
        script.text = scriptTxt;
        head.appendChild(script);
    }

    makeCsv(data: any, options: any) {
        const dataBlob = new Blob([`\ufeff${data}`], { type: 'text/plain;charset=utf-8' });
        return window.URL.createObjectURL(dataBlob);
    }
}