<template>
    <div class="inventory-aging">
  
      <div class="grid-100 tablet-grid-100 ">
  
        <div class="grid-100 tablet-grid-100 container">
          <span class="component-title bold">Sn Activity History</span>
        </div>
           
        <div class="grid-100 tablet-grid-100" v-loading="loading">
  
          <table class="table-client" v-fixed-head>
            <thead>
              <tr>
                <th v-for="head in snActivityHistoryReports.head" :key="head.id" draggable="true" @dragstart="dragStart($event)">
                  {{head}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="snLookUpReport in snActivityHistoryReports.data">
                <td v-for="head in snActivityHistoryReports.head" :key="head.id">
                    {{snLookUpReport[head]}}
                </td>
              </tr>
            </tbody>
          </table>

  
        </div>
      </div>
    </div>
  
  </template>
  <style lang="scss" src="./snActivityHistory.scss" />
  