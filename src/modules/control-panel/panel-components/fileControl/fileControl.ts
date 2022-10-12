import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./fileControl.vue";
import WaittingBtn from '@components/waitting-button/waitting-btn';
import session from '@shared/session';
import ControlPanelService from '@services/control-panel/controlPanelService';
import errorHandler from "@shared/error-handler";
import { forEach } from "lodash-es";

@Component({
    mixins: [template],
    name: 'fileControl',
    components: {
        WaittingBtn
    }
})
export default class FileControl extends Vue {
    excludeLinkedFiles: Boolean = false;
    dialogVisible: Boolean = false;
    disabled: Boolean = false;
    files: any = [];
    taskGroupArr: any = [];
    categoryArr: any = [];
    uploading: Boolean = false;
    dialogImageUrl: string = '';

    @Prop({
        default: function () {
            return {};
        }
    })
    tripDetail!: any;

    created() {
        this.init();
    }

    init() {
        this.getTripFiles();
        this.getTaskGroupArr();
        this.getCateoryList();
    }

    getTripFiles() {
        this.files = this.tripDetail.files;
        forEach(this.files, (item, index) => {
            if (item.task_group_id) {
                item.isLinked = true;
            } else {
                item.isLinked = false;
            }
        });
    }

    getTaskGroupArr() {
        forEach(this.tripDetail.tasks, (task, taskIndex) => {
            forEach(task.stops, (stop, stopIndex) => {
                if (stop.stage != 'linehaul') {
                    forEach(stop.lines, (line, lineIndex) => {
                        if (line.order_pro && line.task_group_id) {
                            let taskGroupInfo = {
                                taskGroupId: line.task_group_id,
                                orderPro: line.order_pro
                            };
                            this.taskGroupArr.push(taskGroupInfo);
                        }
                    });
                }
            });
        });
    }

    getCateoryList() {
        ControlPanelService.fileCatagryList().subscribe(
            (res: any) => {
                this.categoryArr = res.data;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    showMaxImg(url: string) {
        this.dialogImageUrl = '';
        if (url) {
            this.dialogImageUrl = url;
            this.$nextTick(() => {
                this.dialogVisible = true;
            });
        }
    }

    autoUpload(param: any) {
        let formData = new FormData();
        formData.append('file', param.file);
        this.uploading = true;
        ControlPanelService.upLoadFile(formData).subscribe(
            (res: any) => {
                if (res.file.data.file_id) {
                    this.linkFileToTrip(res.file.data);
                } else {
                    errorHandler.handle('file error');
                }
            },
            (err: any) => {
                errorHandler.handle(err);
                this.uploading = false;
            }
        );
    }

    linkFileToTrip(params: any) {
        ControlPanelService.linkFileToTrip(this.tripDetail.trip_no, params).subscribe(
            (res: any) => {
                this.files.push(res);
                this.uploading = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.uploading = false;
            }
        );
    }

    deleteFile(file: any, index: any) {
        file.deleting = true;
        this.$forceUpdate();
        ControlPanelService.deleteFile(file.file_id).subscribe(
            (res: any) => {
                this.files.splice(index, 1);
                file.deleting = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                file.deleting = false;
            }
        );
    }

    handlePictureCardPreview(file: any) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    }

    linkFiletoTask(file: any) {
        let params = {
            tripId: this.tripDetail.trip_no,
            taskGroupId: file.task_group_id
        };
        ControlPanelService.linkFileToTask(file.file_id, params).subscribe(
            (res: any) => {
                file.isLinked = true;
                this.$forceUpdate();
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    selectFileCategory(file: any) {
        let params = {
            tripId: this.tripDetail.trip_no,
            categoryId: file.file_category_id
        };
        ControlPanelService.fileLinkToCatagory(file.file_id, params).subscribe(
            (res: any) => {
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }
}