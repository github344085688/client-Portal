<template>
  <div class="drag-into-groups" @drop="onDrop($event)" @dragover="onAllowDrop($event)">
    <div class="button-box">
      <div style="padding-left:25px; color: #979797;" v-if="dropesList.length < 1"> Drag a column header and drop it
        here to group by that column </div>
      <div class="button" v-for="(list,index) in dropesList">
        <div class="sort-box">
          <div style="height:20px;">
            <img src="../../assets/images/arrow-up.svg" v-show="list.sort" style="height:20px;" :class=" list.sort === 1 ? '' :'rotate' "
            @click.stop.prevent="onSortOrders(list)">
          </div>
          <div class="text" @click.stop.prevent="onPermutationItems(list,index)">{{list.value}}</div>
          <img src="../../assets/images/closed-icon.svg" alt="" style="height:15px;" @click.stop.prevent="onRemoveDropesList(list,index)">
        </div>
      </div>
    </div>
    <div class="operation">
      <div class="cancel" @click.stop.prevent="onCancelDropesList()">
        Cancel
      </div>
      <div class="save" @click.stop.prevent="onSaveLayoutAs" v-if="isSaveLayoutAs">
        Save Layout As        
      </div>
    </div>
    <predefined-dialogs :setStyle="{'width':'30%','height':'50%'}" :title="'Save Layout As'" v-if="isPopUp">
      <div slot="content">
        <div class="layoutList">
          <input class="layoutName" v-model="newLayou.fieldName" :class="{'layoutNameError':isInputError}" :placeholder="inputPlaceholder">
        </div>
      </div>
      <div slot="bottom">
        <div class="layoutBottom">
          <div class="cancel_botton" @click.stop.prevent="onPopUpCancel">CANCEL</div>
          <div class="save_botton"  @click.stop.prevent="onSaveNewLayou">SAVE<loding-node :isLoading="isLoading"></loding-node></div>
        </div>
      </div>
    </predefined-dialogs>
  </div>
</template>
<style lang="scss" src="./drag-into-groups.scss">