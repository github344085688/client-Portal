<template>
    <form @submit.stop.prevent="popUpConfig.submitFunc">
        <pop-up-windows 
                    v-show="syncIsShow" 
                    :height="popUpConfig.height" 
                    :tlitle="popUpConfig.title" 
                    :isSubmit="popUpConfig.isSubmit" 
                    @cancel="popUpConfig.cancelFunc()">
            <load-search-form
                v-if="this.entryType === 'Load'"
                ref="loadSearchForm"
                @search-loads="getLoads"
                :loading="loading"
            ></load-search-form>
            <receipt-search-form
                v-else
                ref="receiptSearchForm"
                @search-loads="getReceipts"
                :loading="loading"
            ></receipt-search-form>
            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client" v-fixed-head>
                    <thead>
                        <tr>
                            <th style="width: 40px;vertical-align: middle">
                                <input type="checkbox" class="unis-checkbox" id="selectAll" :checked="isSelectedAll" @click="toggleSelection()">
                                <label for="selectAll">
                                    <span></span>
                                </label>
                            </th>
                            <th v-for="(head, index) in recordList.head" :key="index">
                                {{head}}
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="(record, index) in recordList.body" :key="index">
                        <tr>
                            <td>
                                <input type="checkbox" 
                                    class="unis-checkbox"
                                    :id="record.id"
                                    :checked="isChecked(record.id)"
                                    @click="toggleSelection(record.id)">
                                <label :for="record.id">
                                    <span></span>
                                </label>
                            </td>
                            <td v-for="(item, index) in recordList.head" :key="index" width="50">
                                <span>
                                    {{record[recordList.headMap[item]]}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </pop-up-windows>
    </form>
</template>
<style lang="scss" scoped>
    .table-client, .table-tracking{
        table-layout: fixed;
        tbody td {
            word-wrap: break-word;
        }
    }
</style>