import { Component, Prop, Watch } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from './multiple-drag-and-drop.vue';
import fileUploadService from "@services/file-upload-service";
import fileService from "@services/file-service";
import util from "@shared/util";
import errorHandler from "@shared/error-handler";
import { forEach, map, concat, keyBy, assign, flattenDeep, indexOf, isEmpty } from 'lodash-es';
import WaittingBtn from "../waitting-button/waitting-btn";
@Component({
    mixins: [tlp],
    components: {
        WaittingBtn
    }
})

export default class MultipleDragAndDrop extends WiseVue {

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

  @Watch('fileTagId')
  getfileTagId(val: any, oldVal: any) {
    if (val) this.getFileByreportId(val);
  }

  @Watch('value')
  getValue(val: any, oldVal: any) {
    if (!val) {
      this.filesNames = [];
      this.fds = [];
    }

  }

  isLoading: boolean = false;
  isImage: boolean = false;
  files: Array<any> = [];
  fd: any = null;
  excelDataFile: any = null;
  imgs: Array<any> = [];
  file: any = {};
  filesNames: Array<any> = [];
  fds: Array<any> = [];
  mapDownloadLoading: any = {};

  async  mounted() {
    let dropbox: any = document.querySelector('.dropbox');
    dropbox.addEventListener('dragenter', this.onDrag, false);
    dropbox.addEventListener('dragover', this.onDrag, false);
    dropbox.addEventListener('drop', this.onDrop, false);

  }

    private  getFileByreportId(reportId: any) {
        let search = {
            fileCategory: "Receipt",
            fileScenario: "Other",
            fileTags: [reportId],
            fileType: "Photo"
        };
        fileService.searchFile(search).subscribe(
            (res: any) => {
                let fileIds = map(res, 'fileId');
                if (res.length > 0) this.searchFileInfo(fileIds, res);
                this.mapDownloadLoading = map(fileIds, (fileId) => {
                    return {[fileId]: false};
                });
            },
            (err: any) => {
                this.error(err);
            }
        );

    }

    private searchFileInfo(fileIds: any, searchFile: any) {
        let keyByfileId = keyBy(searchFile, 'fileId');
        fileService.searchFileInfo({ids: fileIds}).subscribe(
            (res: any) => {
                if (res.length > 0) {
                    let files: Array<any> = [];
                    forEach(res, file => {
                        files.push(assign(file, keyByfileId[file.id]));
                    });
                    this.filesNames = concat(this.filesNames, files);
                }
            },
            (err: any) => {
                this.error(err);
            }
        );
    }

  uploadFile(file: any) {
    this.fd = new FormData();
    this.filesNames.push({name: file.name});
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
    forEach(dt.files, item => {
      if (this.unloadParam) {
        if (item.type == "image/jpeg") {
          this.unloadParam.fileType = "JPG";
        }
        if (item.type == "image/png") {
          this.unloadParam.fileType = "PNG";
        }
        if (item.type == "application/pdf") {
          this.unloadParam.fileType = "PDF";
        }
      }
      this.uploadFile(item);
    });
  }

  async onUpload() {
    if (this.unloadParam && this.unloadParam.documentType && this.unloadParam.documentType.indexOf('Shipping Label') > -1 && !this.unloadParam.trackingNo) {
      this.error("Please enter trackingNo.");
      return;
    }
    this.isLoading = true;
    if (this.fds.length < 1) {
      this.error("Please upload file.");
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
    forEach(filesIds, filesId => {
          this.mapDownloadLoading[filesId] = false;
      });
    this.$forceUpdate();
    this.isLoading = false;
    if (this.uploadSucceedIsDeleteFileName) {
      this.filesNames = [];
      this.fds = [];
    }
    this.$emit('input', filesIds);
    this.$emit('onUpload');
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
        console.log(item);
        if (item.id) {
            fileService.disableFile(item.id).subscribe(
                (res: any) => {
                    this.spliceFiles(item, index);
                },
                (err: any) => {
                    this.error(err);
                }
            );
        }
        else {
            this.spliceFiles(item, index);
        }

    }

  private spliceFiles(item: any, index: any) {
      let fdIndex: any = null;
      forEach(this.fds, (fd, index) => {
          if (fd.get("name") === item.name) fdIndex = index;
      });
      this.fds.splice(fdIndex, 1);
      this.filesNames.splice(index, 1);
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
        let fileDownloadUrl = util.buildItemDownloadUrl(file.fileId);
        fileService.getCombinedPdf(fileDownloadUrl, { responseType: 'arraybuffer'}).then((res => {
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
