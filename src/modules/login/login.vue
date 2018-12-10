<template id="login-form">
<div id="top_container">
    <div class="grid-container margin-top" > 
         	 <div class="grid-100 tablet-grid-100" >
              	 <div class="grid-100 tablet-grid-100 mobile-grid-100 container">
                            <div class="grid-45 tablet-grid-45">
                                <label class="first-title" >Login to Client Portal</label>
                            </div>
                        </div>

						 <div class="grid-100 tablet-grid-100 mobile-grid-100 container">
                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label" for="email_input">EMAIL OR USERNAME</label>
		                        <input class="input-class" type="text" id="email_input"   name="userName" v-model='user.username' v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('userName')}" >
		                        <pre v-if="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</pre>
                            </div>
                        </div>
						
						<div class="grid-100 tablet-grid-100 mobile-grid-100 container">
                            <div class="grid-50 tablet-grid-50">
                                <label class="input-label" for="password_input">PASSWORD</label>
		                        <input class="input-class input"  type="password" id="password_input" name="passWord" v-model='user.password' v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('passWord')}" >
		                        <pre v-if="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</pre>
                            </div>
                        </div>
                        <div class="grid-100 tablet-grid-100 mobile-grid-100 container">
							<div class="grid-50 tablet-grid-50">
						            <ul class="checkbox-list">
                                    
                                        <li style="float:left">
											 <a @click.stop.prevent="showModal" class="checkbox a-forgot-password ">Forgot Password</a>
                                        </li>
                                    </ul>
									<div class="grid-15 tablet-grid-20" style="margin-top: 10px;float:right;padding:0px;">
								        <div>
						                    <button class="button-yellow-medium btn-login"  v-rx-event:click="signInSub">LOGIN</button>
								        </div>
                                   </div>
							</div>
							
						</div>
                       
                        <transition name="fade">
                            <div class="grid-100 tablet-grid-100 mobile-grid-100 container"  v-show="userForm.isSubmitting">
                                <div class="grid-40 tablet-grid-40 container ">
                                    <div class="grid-70 tablet-grid-70 toast-message">
                                    <p>Logging you in...hang tight!</p>
                                    </div>
                                </div>
                            </div>
                        </transition>
         </div>
   </div>
</div>

</template>
<style lang="scss" src="./login.scss"/>