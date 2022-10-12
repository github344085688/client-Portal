<template>
    <div style="padding-bottom: 80px">
        <div class="head grid-100 mt-4">
            <div class="grid-100 pl-0">
                <div class="d-flex justify-content-start grid-80 pl-0">
                    <div class="back-arrow mr-4" @click="goTerminalListPage">←</div>
                    <h2 class="pt-2">{{terminalInfo.terminal_name}}</h2>
                    <div class="control d-flex pl-4">
                        <span :class="'terminal-status terminal-status-' + terminalInfo.status">{{terminalInfo.status_text}}</span>
                    </div>
                </div>
                <div class="control right grid-20 pr-0">
                    <button class="unis-btn unis-btn-primary color-white grid-50 right" @click="goEditPage(terminalInfo.terminal_id)">Edit</button>
                </div>
            </div>
            <div class="mt-3">{{terminalInfo.description}}</div>
        </div>
        <br>
        <div class="mt-4 pl-2">
            <div class="grid-50 terminal-txt-info b-around-1 pt-4 pl-4 pb-4">
                <h3>Basic information</h3>
                <div class="mt-4">
                    <div class="grid-40 pl-0 mt-4">
                        <label for="">Terminal name</label>
                        <div class="mt-1"><strong>{{terminalInfo.terminal_name}}</strong></div>
                    </div>
                    <div class="grid-60 pl-0 mt-4">
                        <label for="">Terminal Code</label>
                        <div class="mt-1"><strong>{{terminalInfo.terminal_code}}</strong></div>
                    </div>
                    <div class="grid-40 pl-0 mt-4">
                        <label for="">Terminal Type</label>
                        <div class="mt-1"><strong>{{terminalInfo.terminal_type}}</strong></div>
                    </div>
                    <div class="grid-60 pl-0 mt-4">
                        <label for="">Gp Location Code</label>
                        <div class="mt-1"><strong>{{terminalInfo.gp_code}}</strong></div>
                    </div>
                    <div class="grid-60 pl-0 mt-4">
                        <label for="">Description</label>
                        <div class="mt-1"><strong>{{terminalInfo.description}}</strong></div>
                    </div>
                    <div class="grid-100 mt-4"></div>
                    <div class="grid-100 pl-0 mt-4">
                        <label for="">Address</label>
                        <div><strong>{{terminalInfo.address_02 ? terminalInfo.address_02 + ',' : ''}}{{terminalInfo.address_01}}</strong></div>
                        <div><strong>{{terminalInfo.city}}, {{terminalInfo.state}} {{terminalInfo.zip}} </strong></div>
                        <div><strong>{{terminalInfo.country}}</strong></div>
                    </div>
                     <div class="grid-60 pl-0 mt-4">
                        <label for="">{{terminalInfo.label == 'telephone' ? 'Telephone' : 'Cellphone'}}</label>
                        <div class="mt-1"><strong>{{terminalInfo.phone}}</strong></div>
                    </div>
                    <div class="grid-60 pl-0 mt-4">
                        <label for="">Email</label>
                        <div class="mt-1"><strong>{{terminalInfo.email}}</strong></div>
                    </div>
                    <div class="grid-90 pl-0 mt-4">
                        <label for="">Fax</label>
                        <div class="mt-1"><strong>{{terminalInfo.fax}}</strong></div>
                    </div>
                    <div class="grid-90 pl-0 mt-4">
                        <label for="">Notes</label>
                        <div class="mt-1"><strong>{{terminalInfo.notes}}</strong></div>
                    </div>
                    <div class="grid-33 pl-0 mt-4">
                        <label for="">Open</label>
                        <div class="mt-1"><strong>{{terminalInfo.open}}</strong></div>
                    </div>
                    <div class="grid-33 pl-0 mt-4">
                        <label for="">Close</label>
                        <div class="mt-1"><strong>{{terminalInfo.close}}</strong></div>
                    </div>
                    <div class="grid-33 pl-0 mt-4">
                        <label for="">Timezone</label>
                        <div class="mt-1"><strong>{{terminalInfo.timezone}}</strong></div>
                    </div>
                </div>
            </div>
            <div class="grid-50 pl-4">
                <div class="grid-100 terminal-txt-info b-around-1 p-4">
                    <h3>Main contact</h3>
                    <div class="mt-4" v-for="(item, index) in terminalInfo.contacts" :key="index">
                        <div class="grid-40 pl-0 mt-4">
                            <label for="">Main contact</label>
                            <div class="mt-1"><strong>{{item.name}}</strong></div>
                        </div>
                        <div class="grid-60 pl-0 mt-4">
                            <label for="">Title</label>
                            <div class="mt-1"><strong>{{item.title}}</strong></div>
                        </div>
                        <div class="grid-100"></div>
                        <div class="grid-100 pl-0 mt-4">
                            <label for="">Phone number</label>
                            <div class="mt-1"><strong>{{item.phone}}</strong></div>
                        </div>
                        <div class="grid-100 pl-0 mt-4">
                            <label for="">Email</label>
                            <div class="mt-1"><strong>{{item.email}}</strong></div>
                        </div>
                    </div>
                </div>
                <!-- <div class="grid-100 terminal-txt-info b-around-1 p-4 mt-4">
                    <h3>Geofence</h3>
                    <div class="mt-4">
                        <button class="unis-btn unis-btn-secondary grid-30">Set up geofence</button>
                    </div>
                </div> -->
                <div class="grid-100 terminal-txt-info b-around-1 p-4 mt-4">
                    <h3>Terminal Matrix</h3>
                    <div class="mt-4">
                        <button class="unis-btn unis-btn-secondary grid-40" @click="goMatrixPage">Set up terminal matrix</button>
                    </div>
                </div>
                <div class="grid-100 terminal-txt-info b-around-1 p-4 mt-4">
                    <h3>Terminal transit zones</h3>
                    <div class="mt-4">
                        <button class="unis-btn unis-btn-secondary grid-40" @click="goDetailPage">Set up transit zones</button>
                    </div>
                </div>
            </div>

            <div class="grid-100 mt-4 pl-0">
                <div class="grid-100 mt-4 terminal-txt-info b-around-1 p-4">
                    <h3>History</h3>
                    <div class="grid-100 mt-4 p-0">
                        <table class="table-client">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="child-table-total" v-for="(item, index) in terminalInfo.history" :key="index">
                                    <td>{{item.update_user}}</td>
                                    <td>{{item.create_date}}</td>
                                    <td class="breake-all">{{item.text}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss" src="./terminalDetail.scss" />