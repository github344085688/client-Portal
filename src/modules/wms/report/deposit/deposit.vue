<template>
  <div class="deposit-wrap">
    <div class="customer-switch" v-show="!showDepositIframe && this.customerIds.length > 0">
      <div>
        <div class="tips">Please switch the customer type</div>
        <predefined-customer-select v-model="customerId" @change="changeCustomer">
        </predefined-customer-select>
          <div class="mt-4">
        <waitting-btn btn-class="unis-btn unis-btn-primary color-white vertical-align h-40-p"  @click="openDepositByCustomerCode" :value="'Deposit'"
        > </waitting-btn>
          </div>
      </div>
    </div>
    <div class="iframe grid-100 tablet-grid-100" v-show="showDepositIframe">
      <waitting-btn btn-class="unis-btn unis-btn-primary color-white vertical-align h-40-p"  @click="changeDepositType" :value="'Switch Customer'" v-if="customerIds.length > 1"
        > </waitting-btn>

      <div class="deposit-container">
        <div>Billing for {{customerTrueName}}:</div>
        <iframe :src="resultDepositUrl"></iframe>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./deposit.scss" />
