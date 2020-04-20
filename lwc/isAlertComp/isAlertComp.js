/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-undef */
import { LightningElement, api, track} from 'lwc';
export default class IsAlertComp extends LightningElement {
    @track toastMsg;
    @track toastFlag;
    @track theme;
    @track assertText;
    @track iconTheme;
    @track icon;

    connectedCallback(){
        this.toastFlag=false;
        this.toastMsg='';
    }
    @api 
    showAlert(msg,msgtype,sec){
        this.toastMsg=msg;
        this.theme=msgtype?'slds-notify slds-notify_toast slds-theme_success':'lds-notify slds-notify_toast slds-theme_error';
        this.assertText=msgtype?'success':'error';
        this.iconTheme=msgtype?'slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top':'slds-icon_container slds-icon-utility-error slds-m-right_small slds-no-flex slds-align-top';
        this.icon=msgtype?'utility:success':'utility:error';
        this.toastFlag=true;
        let TO=setTimeout(()=>{
            clearTimeout(TO);
            this.closeToast();
        },sec);
    }
    @api
    closeToast(){
        this.toastFlag=false;
    }
}