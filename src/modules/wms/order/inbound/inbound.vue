<template>
<div id="top_container">
        <div class="grid-100 tablet-grid-100 container center container-title">
               <div>
                   <span class="border-font">ORDER ENTRY</span>
                </div> 
               <div class="in-out-bound">
                   <input name="somename" type="radio" id="visited_yes">
                   <label for="visited_yes" class="radio"><span class="bold padding-right-60">OUTBOUND</span></label>
                   <input name="somename" type="radio" id="visited_inbound" checked>
                   <label for="visited_inbound" class="radio"><span class="bold">INBOUND</span></label>
               </div>
        </div>
           
        <div class="grid-100 tablet-grid-100 container">
                <div class="grid-85">
                    <div class="grid-100 tablet-grid-100 container">
                        <h1 class="step-header  padding-top-40">
                        <span class="label-number active">1</span>Order Information
                        </h1>
                    
                                <div class="grid-40 tablet-grid-100  padding-top-40">
                                    <div class="grid-80 tablet-grid-100 container"><label class="input-label">SCHEDULE ENTRY</label> <input type="text"></div>
                                    <div class="grid-80 tablet-grid-100 container padding-top-40"><label class="input-label">REFERENCE #ENTRY</label> <input type="text"></div>
                                </div>
                                <div class="grid-60 tablet-grid-100  center">
                                    <div class="grid-25 tablet-grid-33">
                                        <label >BOL</label>
                                            <div class="uploadfile margin-top-15">
                                                 <img src="@/assets/images/bol.png"  alt="logo" class="upload-image" />
                                            </div>
                                    </div>     
                                    <div class="grid-25 tablet-grid-33"><label >POD</label>
                                       <div class="uploadfile margin-top-15">
                                           
                                        </div>
                                     </div>     
                                    <div class="grid-25 tablet-grid-33"><label >Shipping Label</label>
                                    <div class="uploadfile margin-top-15">
                                         <img src="@/assets/images/shippinglabel.png"  alt="logo" class="upload-image" />
                                        </div>
                                        </div>     
                                </div>
                    </div>
                     <div class="grid-100 tablet-grid-100 container">
                    
                            <div class="padding-top-40">
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIP FROM</label> 
                                  <address-auto-complete v-model="address.id" @change="selectAddressChange" :tags="['Store', 'ShipTo']" :organizationId="'ORG-3'"  :clearable="true" >
                                    </address-auto-complete>
                                
                                </div>
                                <div class="grid-12 tablet-grid-50 container" style="position:relative"><label class="input-label">CONTACT INFO</label> 
                                    <i class="fa fa-phone  position-phone"></i> 
                                    <i class="far fa-envelope  position-email"></i>
                                    <input type="text" class="padding-right-45">
                                 </div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">BILL INFO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTACT INFO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIP TO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTACT INFO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SOLD TO</label>
                                   <!-- <SingleSelect :options="options" v-model="receipt.value" @selectChangeAction="selectChange" :remoteSearchMethod="searchRemoteData" :filterable="true" :clearable="true" :remote="true">
                                      <slot name="sd"></slot>
                                  </SingleSelect> -->
                                    <organization-auto-complete v-model="soldTo.id" @change="selectChange"  :clearable="true" >
                                    </organization-auto-complete>
                                </div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTACT INFO</label> <input type="text"></div>

                            </div>
                            
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                    
                            <div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">PURCHASE ORDER #</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">BATCH #</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">BILL OF LADING #</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE #</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE #1</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE #2</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE #3</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE #4</label> <input type="text"></div>
                                
                            </div>
                            
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                    
                            <div style="position:relative">
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">ORDERED DATED</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SCHEDULED DATE</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">ROUTED DATE</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">MADB</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIP NOT BEFORE</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIP NO LATER</label><Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CANCEL DATE</label>
                                <Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker>
                                 </div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">REFERENCE DATE 1</label>
                                   <Datepicker :input-class="{'input-date':true,'input': true}" ></Datepicker>

                                </div>
                                
                            </div>
                            
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                        <h1 class="step-header  padding-top-80">
                        <span class="label-number">2</span>Freight Term
                        </h1>
                            <div class="padding-top-30">
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIP METHOD</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">DELIVERY SERVICE</label> <select class="dropdown"></select></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">FREIGHT RATE</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">FREIGHT TERM</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SHIPPING ACCOUNT</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CARRIER INFO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTACT INFO</label> <input type="text"></div>
                                <div class="grid-12 tablet-grid-50 container"><label class="input-label">SCACCODE</label> <input type="text"></div>
                                
                            </div>
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                        
                                <div>
                                    <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTAINER SIZE</label> <select class="dropdown"></select></div>
                                    <div class="grid-12 tablet-grid-50 container"><label class="input-label">CONTAINER #</label> <input type="text"></div>
                                    <div class="grid-33 tablet-grid-50 container"><label class="input-label">NOTE</label> <input type="text"></div>              
                                </div>
                                
                    </div>
                
                </div>

                <user-profile-sidebar></user-profile-sidebar>

           
        </div>

         <div class="grid-100 tablet-grid-100 container">
            <div class="margin-bottom-15"> 
                <div class="grid-100 tablet-grid-100 container">
                                <h1 class="step-header  padding-top-80">
                                <span class="label-number">3</span>Item Detail
                                </h1>
                                    <div class="padding-top-30">
                                        <div class="grid-10 tablet-grid-50  container"><label class="input-label">LINE #</label> <input type="text"></div>
                                        <div class="grid-10 tablet-grid-50  container"><label class="input-label">ITEM ID</label> 
                                         <item-auto-complete v-model="receipt.id" @change="itemSelectChange"  :clearable="true">
                                        </item-auto-complete>
                                        </div>
                                        <div class="grid-10 tablet-grid-50  container"><label class="input-label">PRODUCT</label> <input type="text"></div>
                                        <div class="grid-10 tablet-grid-50  container"><label class="input-label">ORDERED QUANTITY</label> <input type="text"></div>
                                        <div class="grid-10 tablet-grid-50  container"><label class="input-label">UNIT PRICE</label> <input type="text"></div>
                                        <div class="grid-5 tablet-grid-50  container"><label class="input-label"> LOT #</label> <input type="text"></div>
                                        <div class="grid-9 tablet-grid-50  container"><label class="input-label">PALLET QUANTITY</label> <input type="text"></div>
                                        <div class="grid-9 tablet-grid-50  container"><label class="input-label">PALLET WEIGHT</label> <input type="text"></div>
                                        <div class="grid-9 tablet-grid-50  container"><label class="input-label">PALLET SIZE ID</label> <input type="text"></div>
                                        <div class="grid-9 tablet-grid-40  container"><label class="input-label">CUSTOMER PALLETS</label> <input type="text"></div>
                                        <div class="grid-9 tablet-grid-10  container center"> 
                                             <span class="trash" href="javascript:;">
                                                <i class="fas fa-trash fa-lg"></i>
                                            </span>
                                            <!-- <button class="button-standard-small remove"> </button> -->
                                        </div>


                                    </div>
            
                </div>
            </div>
             <div class="grid-100 tablet-grid-100 container">
                               <div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">SUPPLIER ID</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">UPC CODE</label>  <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">ORIGINAL PRODUCT</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">BUYER ITEM ID</label> <input type="text"></div>
                                <div class="grid-6 tablet-grid-50  container"><label class="input-label">UOM</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">PACKAGE CONFIGURE</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">PREPACK QUANTITY</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">LBS PER PACKAGE </label> <input type="text"></div>
                                <div class="grid-5 tablet-grid-50  container"><label class="input-label">LENGTH </label> <input type="text"></div>
                                <div class="grid-5 tablet-grid-50  container"><label class="input-label">WIDTH </label> <input type="text"></div>
                                <div class="grid-5 tablet-grid-50  container"><label class="input-label">HEIGHT </label> <input type="text"></div>

                            </div>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                               <div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">ITEM NOTE</label> <input type="text"></div>
                                <div class="grid-10 tablet-grid-50  container"><label class="input-label">DETAIL MISC 1-7</label>  <input type="text"></div>

                               </div>
            </div>
        </div>

         <div class="grid-100 tablet-grid-100 container">
            <div  class="grid-60 tablet-grid-100 container">
                  <div class="grid-100 tablet-grid-100 container padding-top-40">
                      <div class="grid-5 tablet-grid-50  container">&nbsp;</div>
                      <div class="grid-25 tablet-grid-40"><button class="button-standard-small add"> ADD</button></div>
                  </div>
                  <div class="grid-100 tablet-grid-100 container">
                          <h1 class="step-header  padding-top-80">
                            <span class="label-number">3</span>Item Detail
                            </h1>
                               <div class="padding-top-30">
                                <div class="grid-20 tablet-grid-50  container"><label class="input-label">TOTAL CASES </label> <input type="text"></div>
                                <div class="grid-20 tablet-grid-50  container"><label class="input-label">TOTAL PALLET</label>  <input type="text"></div>
                                <div class="grid-20 tablet-grid-50  container"><label class="input-label">TOTAL WEIGHT</label>  <input type="text"></div>
                                <div class="grid-20 tablet-grid-50  container"><label class="input-label">TOTAL CBFT</label>  <input type="text"></div>

                               </div>
                  </div>
            </div>
            <div  class="grid-40 tablet-grid-100 container">
                <div class="rectangle">
                    <div class="five-style">5.</div>
                    <div class="rectangle-container"><label class="input-label">Freight Quote </label> </div>
                    <div class="rectangle-container"><input type="text"></div>
                    <div class="rectangle-container"><button class="button-standard-small "> GET QUOTE</button></div>
                </div>
            </div>
         </div>

         <div class="grid-100 tablet-grid-100 container padding-top-80">
             <div class="grid-20 tablet-grid-50  container">&nbsp;</div>
                <div class="grid-20 tablet-grid-50  container"><button class="button-standard-large "> CANCEL </button></div>
                <div class="grid-20 tablet-grid-50  container"><button class="button-standard-large "> SAVE ORDER </button></div>
                <div class="grid-20 tablet-grid-50  container"> <button class="button-yellow-large"> PLACE ORDER</button></div>
                <div class="grid-20 tablet-grid-50  container">&nbsp;</div>
         </div>
</div>

</template>
<style lang="scss" src="./inbound.scss"/>