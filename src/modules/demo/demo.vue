<template>
    <div id="sitecontent">
        <!-- BEGINNING OF LANDING PAGE - SALES PORTAL -->
        <div class="row grid-container">
            <div class="grid-100 tablet-grid-100 simple-landing">
                <div class="grid-100 tablet-grid-100 container">
                    <h1 class="title-gray">Let's Get Started</h1>
                    <button type="button" class="grid-15 tablet-grid-30 button-yellow-large">Customer Signup</button>
                </div>
            </div>
        </div>
        <!-- END OF LANDING PAGE - SALES PORTAL -->

        <!-- BEGINNING OF CUSTOMER SIGN UP -->
        <div class="row grid-container">
            <div class="grid-100 tablet-grid-100 container">
                <StageHeader :headerTitle="'Customer Signup'" :headerSubtitle="'Signup'" :stage="1" :pages="['Signup','Additional Information','Review']"></StageHeader>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-100 tablet-grid-100 container step-container">
                    <div class="grid-50 tablet-grid-80 container">
                        <div class="grid-100 tablet-grid-100 container">
                            <h1 class="step-header">
                                <span class="label-number active">1</span>Shipping Information
                            </h1>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <label class="input-label">Company</label>
                            <input type="text">
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <label class="input-label">Address 1</label>
                            <input type="text">
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <label class="input-label">Address 2</label>
                            <input type="text">
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-60 tablet-grid-60">
                                <label class="input-label">City</label>
                                <input type="text">
                            </div>

                            <div class="grid-20 tablet-grid-20">
                                <label class="input-label">State</label>
                                <select class="dropdown"></select>
                            </div>

                            <div class="grid-20 tablet-grid-20">
                                <label class="input-label">Zip Code</label>
                                <input type="text">
                            </div>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label">Phone</label>
                                <input type="text">
                            </div>

                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label optional-label">Fax</label>
                                <input type="text">
                            </div>

                            <div>&nbsp;</div>
                        </div>
                    </div>

                    <div class="grid-50 tablet-grid-80">
                        <div class="grid-100 tablet-grid-100 container">
                            <h1 class="step-header">
                                <span class="label-number">2</span>Billing Information

                                <input type="checkbox" id="billing_info">
                                <label class="checkbox" for="billing_info">
                                    <span>Same as Shipping Address</span>
                                </label>
                            </h1>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <label class="input-label">Address 1</label>
                            <input type="text">
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <label class="input-label">Address 2</label>
                            <input type="text">
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-60 tablet-grid-60">
                                <label class="input-label">City</label>
                                <input type="text">
                            </div>

                            <div class="grid-20 tablet-grid-20">
                                <label class="input-label">State</label>
                                <select class="dropdown"></select>
                            </div>

                            <div class="grid-20 tablet-grid-20">
                                <label class="input-label">Zip Code</label>
                                <input type="text">
                            </div>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-60 tablet-grid-60">
                                <label class="input-label">Requested Credit Limit</label>
                                <input type="text" value="$500">
                            </div>

                            <div>&nbsp;</div>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="info-container">
                                <p>
                                    <span class="text-bold">Note: </span> Many customers will be granted an immediate $500 credit limit.</p>
                            </div>
                        </div>

                        <div class="grid-100 tablet-grid-100 container">
                            <h1 class="step-header">
                                <span class="label-number">3</span>Account Creation
                            </h1>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label">First Name</label>
                                <input type="text">
                            </div>

                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label">Last Name</label>
                                <input type="text">
                            </div>
                        </div>

                        <div class="grid-80 tablet-grid-100 container">
                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label">Email</label>
                                <input type="text">
                            </div>

                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label">Username</label>
                                <input type="text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container" style="margin: 40px 55px;">
                <MainButtonSet :rightBtnText="'Next'"></MainButtonSet>
            </div>
        </div>
        <!-- END OF CUSTOMER SIGN UP -->

        <!-- BEGINNING OF CUSTOMER SIGNUP ADDITIONAL INFO -->
        <div class="grid-container">
            <div class="grid-100 tablet-grid-100 container">
                <StageHeader :headerTitle="'Customer Signup'" :headerSubtitle="'Additional Information'" :stage="2" :pages="['Signup','Additional Information','Review']"></StageHeader>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-100 tablet-grid-100 container step-container">
                    <div class="grid-100 tablet-grid-100 container">
                        <h1 class="step-header">
                            <span class="label-number active">4</span>More About the Company
                        </h1>
                    </div>

                    <div class="grid-100 tablet-grid-100 container">
                        <p class="sub-header">For Sales team only:</p>
                    </div>

                    <div class="grid-100 tablet-grid-100">
                        <p class="text-bold">1. Have you visited the shipping location for this company?</p>
                    </div>

                    <div class="grid-100 tablet-grid-100 container indent-15">
                        <input type="radio" id="visited_yes">
                        <label class="radio" for="visited_yes">
                            <span>Yes</span>
                        </label>

                        <input type="radio" id="visited_no">
                        <label class="radio" for="visited_no">
                            <span>No</span>
                        </label>
                    </div>

                    <div class="grid-100 tablet-grid-100 container">
                        <p class="sub-header">Ask the customer the following questions to learn more about their needs and how we can serve them.</p>
                    </div>

                    <div class="grid-100 tablet-grid-100 container">
                        <div class="grid-50 tablet-grid-50">
                            <div class="grid-parent grid-80 tablet-grid-100 container">
                                <p class="text-bold">2. How do you receive your orders from your customers?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <input type="text">
                            </div>

                            <div class="grid-parent grid-80 tablet-grid-100 ">
                                <p class="text-bold margin-top-20">3. Is this your only shipping location?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <input type="radio" id="only_location_yes">
                                <label class="radio" for="only_location_yes">
                                    <span>Yes</span>
                                </label>

                                <input type="radio" id="only_location_no">
                                <label class="radio" for="only_location_no">
                                    <span>No</span>
                                </label>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">Additional shipping locations</label>
                                <input type="text">
                            </div>

                            <div class="grid-parent grid-80 tablet-grid-100">
                                <p class="text-bold margin-top-20">4. Do you ship truckload shipments?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <input type="radio" id="truckload_yes">
                                <label class="radio" for="truckload_yes">
                                    <span>Yes</span>
                                </label>

                                <input type="radio" id="truckload_no">
                                <label class="radio" for="truckload_no">
                                    <span>No</span>
                                </label>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">If "Yes", where do you ship?</label>
                                <input type="text">
                            </div>

                            <div class="grid-parent grid-80 tablet-grid-100 container">
                                <p class="text-bold margin-top-20">5. Annual freight spend?</p>
                            </div>

                            <div class="grid-50 tablet-grid-100 container">
                                <select class="dropdown">
                                    <option>Select</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid-50 tablet-grid-50">
                            <div class="grid-parent grid-80 tablet-grid-100 container">
                                <p class="text-bold">6. How many LTL shipments do you ship each week?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <div class="grid-20 tablet-grid-30">
                                    <input type="text">
                                </div>
                            </div>

                            <div class="grid-parent grid-80 tablet-grid-100">
                                <p class="text-bold margin-top-20">7. Do you contract with 3PL warehouses?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <input type="radio" id="3pl_warehouse_yes">
                                <label class="radio" for="3pl_warehouse_yes">
                                    <span>Yes</span>
                                </label>

                                <input type="radio" id="3pl_warehouse_no">
                                <label class="radio" for="3pl_warehouse_no">
                                    <span>No</span>
                                </label>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">Additional shipping locations</label>
                                <input type="text">
                            </div>

                            <div class="grid-parent grid-80 tablet-grid-100">
                                <p class="text-bold margin-top-20">8. Do you contract with drayage services?</p>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <input type="radio" id="drayage_yes">
                                <label class="radio" for="drayage_yes">
                                    <span>Yes</span>
                                </label>

                                <input type="radio" id="drayage_no">
                                <label class="radio" for="drayage_no">
                                    <span>No</span>
                                </label>
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">Additional information</label>
                                <input type="text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-container">
            <div class="grid-100 tablet-grid-100">
                <div class="grid-100 tablet-grid-100 container">
                    <StageHeader :headerTitle="'Customer Signup'" :headerSubtitle="'Review'" :stage="3" :pages="['Signup','Additional Information','Review']"></StageHeader>
                </div>

                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100">
                            <h1 class="step-header">
                                <span class="label-number-summary">1</span>Shipping Information</h1>
                        </div>

                        <div class="grid-100 tablet-grid-100 container">
                            <table class="table-details">
                                <tbody>
                                    <tr>
                                        <td>Company</td>
                                        <td>TelAmeriCorp</td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>3242 Southside Lane <br>Suite 200<br>Rancho Cucamonga, CA 90014
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>909-766-6772</td>
                                    </tr>
                                    <tr>
                                        <td>Fax</td>
                                        <td>909-595-2998</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100">
                            <h1 class="step-header">
                                <span class="label-number-summary">2</span>Billing Information</h1>
                        </div>

                        <div class="grid-100 tablet-grid-100 container">
                            <table class="table-details">
                                <tbody>
                                    <tr>
                                        <td>Address</td>
                                        <td>3242 Southside Lane<br>Suite 200<br>Rancho Cucamonga, CA 91701</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>909-766-6772</td>
                                    </tr>
                                    <tr>
                                        <td>Fax</td>
                                        <td>909-595-2998</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container margin-bottom-40">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-25 tablet-grid-40 margin-left-50">
                            <button class="button-standard-small edit"> Edit</button>
                        </div>
                    </div>

                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-25 tablet-grid-40 margin-left-50">
                            <button class="button-standard-small edit"> Edit</button>
                        </div>
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100">
                            <h1 class="step-header">
                                <span class="label-number-summary">3</span>Account Creation</h1>
                        </div>

                        <div class="grid-100 tablet-grid-100 container">
                            <table class="table-details">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>Black Anderson</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>black.anderson@telamericorp.com</td>
                                    </tr>
                                    <tr>
                                        <td>Username</td>
                                        <td>blake.anderson</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100">
                            <h1 class="step-header">
                                <span class="label-number-summary">4</span>Credit Application</h1>
                        </div>

                        <div class="grid-100 tablet-grid-100">
                            <p class="sub-header margin-left-50">Please instruct the customer to fill out the credit application form.</p>
                        </div>
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container margin-left-50 margin-bottom-40">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-25 tablet-grid-40">
                            <button class="button-standard-small edit"> Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-container">
            <div class="grid-100 tablet-grid-100">
                <div class="grid-100 tablet-grid-100 container title">
                    <h1 class="title">My Account</h1>
                </div>

                <div class="grid-parent grid-100 tablet-grid-100 container">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100">
                            <h1 class="section-header">Account Information</h1>
                        </div>

                        <div class="grid-100 tablet-grid-100 container margin-bottom-40">
                            <table class="table-details margin-left-minus-10">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>Simanek</td>
                                    </tr>
                                    <tr>
                                        <td>Username</td>
                                        <td>scott.simanek</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>scott.simanek@unisco.com</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>301-342-0110</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="grid-100 tablet-grid-100 container">
                            <div class="grid-25 tablet-grid-40">
                                <button class="button-standard-small edit">Edit</button>
                            </div>

                            <div class="grid-35 tablet-grid-60">
                                <button class="button-standard-small">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-container">
            <div class="grid-100 tablet-grid-100">
                <div class="grid-100 tablet-grid-100 container title">
                    <h1 class="title">My Account</h1>
                    <p class="sub-header sub-title">Editing Mode</p>
                </div>

                <div class="grid-parent grid-100 tablet-grid-100 container">
                    <div class="grid-50 tablet-grid-50">
                        <div class="grid-100 tablet-grid-100 container">
                            <h1 class="section-header">Account Information</h1>
                        </div>

                        <div class="grid-parent grid-100 tablet-grid-100">
                            <div class="grid-50 tablet-grid-70 container">
                                <label class="input-label">Name</label>
                                <input type="text" value="Scott Simanek">
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">Username</label>
                                <input type="text" value="scott.simanek">
                            </div>

                            <div class="grid-80 tablet-grid-100 container">
                                <label class="input-label">Email</label>
                                <input type="text" value="scott.simanek@unisco.com">
                            </div>

                            <div class="grid-80 tablet-grid-100 container margin-bottom-40">
                                <label class="input-label optional-label">Phone</label>
                                <input type="text" value="213-529-0000">
                            </div>

                            <div class="grid-100 tablet-grid-100 container">
                                <div class="grid-30 tablet-grid-40">
                                    <button class="button-standard-small">Save Updates</button>
                                </div>

                                <div class="grid-35 tablet-grid-60">
                                    <button class="button-standard-small">Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END OF SALES PORTAL -->
            <div class="grid-100 tablet-grid-100 mobile-grid-100">
                <StageHeader :headerTitle="'Customer Signup'" :headerSubtitle="'Sign up'" :stage="2" :pages="['Signup','Additional Info','Review']"></StageHeader>
                <StageHeader :headerTitle="'ABC'" :headerSubtitle="'cde'" :stage="1" :pages="['Page 1','Page 2','Page 3','Page 4']"></StageHeader>
                <StageHeader :headerTitle="'CDE Page'" :headerSubtitle="'Im subtitle'" :stage="4" :pages="['Page 1','Page 2','Page 3','Page 4']"></StageHeader>
            </div>
        </div>
    </div>
</template>

