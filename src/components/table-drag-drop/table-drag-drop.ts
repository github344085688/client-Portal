import { Component, Prop, Watch } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from './table-drag-drop.vue';
import fileUploadService from "@services/file-upload-service";
import fileService from "@services/file-service";
import orderService from "@services/order-service";
import util from "@shared/util";
import errorHandler from "@shared/error-handler";
import { forEach, map, concat, keyBy, assign, flattenDeep, indexOf, difference } from 'lodash-es';
import WaittingBtn from "../waitting-button/waitting-btn";
@Component({
    mixins: [tlp],
    components: {
        WaittingBtn
    }
})

export default class TableDragDrop extends WiseVue {

  @Prop({ default: 400})
  height!: number;

  @Prop({ default: null})
  img!: number;

  @Prop({ default: false})
  analysis!: boolean;

  @Prop({ default: ''})
  imports!: any;

  @Prop({ default: 'image/*'})
  accept!: string;

  @Prop({ default: '' })
  required!: any ;

  @Prop({ default: '' })
  isShow!: any ;

  @Prop({ default: '' })
  value!: any ;

  @Prop({ default: '' })
  fileTagId!: any ;

  @Prop({ default: '' })
  acceptTypeLimit!: any ;

  @Prop({ default: 100 })
  uploadLimit!: number ;

  @Prop({ default: false })
  uploadSucceedIsDeleteFileName!: boolean ;

  @Prop({ default: '' })
  unloadParam!: any;

  @Prop({ default: '' })
  tag!: any;

  @Prop({ default: 'id' })
  getFileById!: any;

  @Prop({ default: '' })
  accessUrl!: any;

  @Watch('isShow')
  getShow(val: any, oldVal: any) {
    if (val) this.uploadFiles = [];
      if (this.tag === 'receipt' && val) this.getFileByreportId(this.fileTagId);
      if (this.tag === 'order' && val) this.getBamOrder(this.fileTagId);
  }

  @Watch('value')
  getValue(val: any, oldVal: any) {
    if (!val) {
      this.filesNames = [];
      this.fds = [];
    }

  }

  isLoading: boolean = false;
  isFilesLoading: boolean = false;
  isImage: boolean = false;
  files: Array<any> = [];
  fd: any = null;
  excelDataFile: any = null;
  imgs: Array<any> = [];
  file: any = {};
  filesNames: Array<any> = [];
  uploadFiles: Array<any> = [];
  fds: Array<any> = [];
  mapDownloadLoading: any = {};
  mapRemoveLoading: any = {};

    async  mounted() {
        let dropbox: any = document.querySelector('.dropbox');
        if (dropbox) {
            dropbox.addEventListener('dragenter', this.onDrag, false);
            dropbox.addEventListener('dragover', this.onDrag, false);
            dropbox.addEventListener('drop', this.onDrop, false);
        }
    }

    private  getFileByreportId(reportId: any) {
        this.filesNames = [];
        this.isFilesLoading = true;
        let search = {
            fileCategory: "Receipt",
            fileScenario: "Other",
            fileTags: [reportId],
            fileType: "Photo"
        };
        fileService.searchFile(search, this.accessUrl).subscribe(
            (res: any) => {
                let fileIds = map(res, 'fileId');
                if (res.length > 0) {
                    this.searchFileInfo(fileIds, res);
                } else {
                    this.isFilesLoading = false;
                }
                this.mapDownloadLoading = map(fileIds, (fileId) => {
                    return {[fileId]: false};
                });
            },
            (err: any) => {
                this.error(err);
            }
        );

    }

    private getBamOrder(orderId: any) {
        this.isFilesLoading = true;
        orderService.getBamOrder(orderId, this.accessUrl).subscribe(
            (res: any) => {
                this.searchFileInfo(res.fileIds, res.fileIds);
            },
            (err: any) => {

                this.error(err);
            }
        );
    }

    private searchFileInfo(fileIds: any, searchFile: any) {
        fileService.searchFileInfo({ ids: fileIds }).subscribe(
            (res: any) => {
                if (res.length > 0) {
                    let files: Array<any> = [];
                    if (this.tag === 'receipt') {
                        let keyByfileId = keyBy(searchFile, 'fileId');
                        forEach(res, file => {
                            files.push(assign(file, keyByfileId[file.id]));
                        });
                    }
                    if (this.tag === 'order') {
                        files = res;
                    }
                    this.filesNames =  files;
                } else this.filesNames =  [];
                this.isFilesLoading = false;
            },
            (err: any) => {
                this.error(err);
                this.isFilesLoading = false;
            }
        );
    }

    uploadFile(file: any) {
        this.fd = new FormData();
        this.uploadFiles.push({name: file.name});
        this.fd.append("myFile", file);
        this.fd.append("app", "fd-app");
        this.fd.append("module", "organization");
        this.fd.append("service", "logofile");
        this.fd.append("name", file.name);
        this.fds.push(this.fd);
    }

    onDrag(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }

    onDrop(e: any) {
        e.stopPropagation();
        e.preventDefault();
        let dt = e.dataTransfer;
        forEach(dt.files, item => this.uploadFile(item));
    }

    async onUpload() {
        if (this.unloadParam && this.unloadParam.documentType && this.unloadParam.documentType.indexOf('Shipping Label') > -1 && !this.unloadParam.trackingNo) {
            this.error("Please enter trackingNo.");
            return;
        }
        this.isLoading = true;
        if (this.fds.length < 1) {
            this.isLoading = false;
            return;
        }
        let onUploads: Array<any> = [];
        forEach(this.fds, fd => {
            onUploads.push(
                fileUploadService.fileUpload("/file-app/file-upload", fd).toPromise()
            );
        });
        let mapUploadFile = await Promise.all(onUploads);
        let filesIds = flattenDeep(map(mapUploadFile, 'filesId'));
        if (this.tag === 'receipt') {
            let fileRntrys: Array<any> = [];
            forEach(filesIds, id => {
                this.mapDownloadLoading[id] = false;
                let params = {
                    fileId: id,
                    tags: [this.fileTagId]
                };

                fileRntrys.push(fileService.fileRntry(params, this.accessUrl).toPromise());
            });

            await Promise.all(fileRntrys);
            this.getFileByreportId(this.fileTagId);
        }
        if (this.tag === 'order') {
            let mapFileIds = map(this.filesNames, 'id');
            filesIds = concat(filesIds, mapFileIds);
            orderService.upDataOrder(this.fileTagId, {fileIds: filesIds}, this.accessUrl).subscribe(
                (res: any) => {
                    this.getBamOrder(this.fileTagId);
                },
                (err: any) => {

                    this.error(err);
                }
            );
        }
        this.uploadFiles = [];
        this.fds = [];
        this.isLoading = false;


    }

    addImg() {
        if (this.fds.length >= this.uploadLimit) {
            this.error("Only " + this.uploadLimit + " file can be uploaded.");
            return;
        }
        let inputDOM: any = this.$refs.inputer;
        if (inputDOM.files[0] && this.unloadParam) {
            if (inputDOM.files[0].type == "image/jpeg") {
                this.unloadParam.fileType = "JPG";
            }
            if (inputDOM.files[0].type == "image/png") {
                this.unloadParam.fileType = "PNG";
            }
            if (inputDOM.files[0].type == "application/pdf") {
                this.unloadParam.fileType = "PDF";
            }
        }
        if (this.acceptTypeLimit) {
            let acceptTypeList = this.acceptTypeLimit.split(",");
            if (indexOf(acceptTypeList, inputDOM.files[0].type) == -1) {
                this.error("Please upload " + this.acceptTypeLimit + " file.");
                return;
            }
        }
        forEach(inputDOM.files, (item: any) => {
            if (item.type.indexOf('image') > -1) this.isImage = true;
            this.uploadFile(item);
        });
    }

    async removeFile(item: any, index: any) {

        if (item.id) {
            this.popups({
                title: 'Remove Attachment ',
                content: `Would you like to remove this ${item.name} ?`,
                cancel: 'No',
                confirm: 'Yes'
            }).then(
                (res: any) => {
                    this.mapRemoveLoading[item.id] = true;

                    if (this.tag === 'receipt') {
                        fileService.disableFile(item.id, this.accessUrl).subscribe(
                            (res: any) => {
                                this.getFileByreportId(this.fileTagId);
                                this.mapRemoveLoading[item.id] = false;
                                this.$forceUpdate();
                            },
                            (err: any) => {
                                this.error(err);
                                this.mapRemoveLoading[item.id] = false;
                            }
                        );
                    }
                    if (this.tag === 'order') {

                        let fileIds = difference(map(this.filesNames, 'id'), [item.id]);
                        orderService.upDataOrder(this.fileTagId, {fileIds: fileIds}, this.accessUrl).subscribe(
                            (res: any) => {
                                this.getBamOrder(this.fileTagId);
                                this.mapRemoveLoading[item.id] = false;
                                this.$forceUpdate();
                            },
                            (err: any) => {
                                this.error(err);
                                this.mapRemoveLoading[item.id] = false;

                            }
                        );
                    }


                }
            );
        }
        else {
            this.uploadFiles.splice(index, 1);
        }

    }


    private spliceFiles(item: any, index: any) {
        let fdIndex: any = null;
        forEach(this.fds, (fd, index) => {
            if (fd.get("name") === item.name) fdIndex = index;
        });
        this.fds.splice(fdIndex, 1);
        this.filesNames.splice(index, 1);
        this.mapRemoveLoading[item.id] = false;
        this.$forceUpdate();
    }


    private initialization() {
        this.isLoading = false;
        this.files = [];
        this.fd = null;
        this.excelDataFile = null;
        this.file = {};
    }


    downloadFile(file: any) {
        this.mapDownloadLoading[file.id] = true;
        let fileDownloadUrl = util.buildItemDownloadUrl(file[this.getFileById]);
        fileService.getCombinedPdf(fileDownloadUrl, {responseType: 'arraybuffer'}).then((res => {
            this.mapDownloadLoading[file.id] = false;
            this.$forceUpdate();
            util.exportFile(res, file.name);
        })).catch(err => {
            errorHandler.handle(err);
            this.mapDownloadLoading[file.id] = false;
            this.$forceUpdate();
        });

    }

}
