import { LightningElement,api,track } from 'lwc';

export default class LoanContactComp extends LightningElement {
    @api loanContactRoleOptions=[];
    @api loanContact;
    @track loanContactResult;

    @api goData;
    @api goBol=false;
    @track lookupcreation=true;

    deleteComp(){
        this.dispatchEvent(new CustomEvent('removeloancontact',{'detail':this.loanContact.LoanContactId}));
    }

    @api 
    collectLoanContactData(){
        return this.loanContactResult;
    }
    @api validateLoanContactData(){
        this.loanContactResult={};
        let valid=false;
        console.log(this.template.querySelector('[data-id="LoanContactContact"]'));
        if(!this.template.querySelector('[data-id="LoanContactContact"]').checkValidity()){
            valid=true;
            this.template.querySelector('[data-id="LoanContactContact"]').setCustomValidity('Please Select Contact');
            this.template.querySelector('[data-id="LoanContactContact"]').reportValidity();
            this.loanContactResult.Contact_Input__c=null
        }else{
            this.template.querySelector('[data-id="LoanContactContact"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanContactContact"]').reportValidity();
            this.loanContactResult.Contact_Input__c=this.template.querySelector('[data-id="LoanContactContact"]').getRecordId();
        }
        if(this.template.querySelector('[data-id="LoanContactRole"]').value==null){
            valid=true;
            this.template.querySelector('[data-id="LoanContactRole"]').setCustomValidity('Please choose role');
            this.template.querySelector('[data-id="LoanContactRole"]').reportValidity();
            this.loanContactResult.Role__c=null;
        }else{
            this.template.querySelector('[data-id="LoanContactRole"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanContactRole"]').reportValidity();
            this.loanContactResult.Role__c=this.template.querySelector('[data-id="LoanContactRole"]').value;
        }
        if(!valid){
            //alert(JSON.stringify(this.loanContactResult));
        }else{
            //this.loanContactResult=null;
        }
        return valid;
    }

}