/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
import { LightningElement,api,wire,track } from 'lwc';
import collectGeneralDependency from '@salesforce/apex/CaseController.collectGeneralDependency';
import getSObjectDetails from '@salesforce/apex/CaseController.getSObjectDetails';
import getContactDetails from '@salesforce/apex/CaseController.getContactDetails';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';


export default class CaseComp extends LightningElement {
    @track PriorityOptions=[];
    @track StatusOptions=[];
    @track TypeOptions=[];

    @track LoanCount=1;
    @track LoanTypeOptions=[];
    @track LoanInstallmentFrequencyOptions=[];
    @track LoanIntrestTypeOptions=[];
    @track AssetRecordTypeOptions=[];

    @track LoanContactRoleOptions=[];

    @track LoanArr=[];
    @api caseActiveTabs=['CaseInformation','BorrowerAccountInformation','BorrowerContactInformation'];
    @api accountName;
    @api accountPhone;
    @api accountStreet;
    @api accountCity;
    @api accountState;
    @api accountPostalCode;
    @api accountCountry;
    @api accountABN;
    @api accountACN;

    @api contactFirstName;
    @api contactLastName;
    @api contactPhone;
    @api contactMobilePhone;
    @api contactBirthdate;
    @api contactEmail;
    @api contactStreet;
    @api contactCity;
    @api contactState;
    @api contactPostalCode;
    @api contactCountry;
    
    @api subject;
    // Reactive variables
    @track controllingValues = [];
    @track dependentValues = [];
    @track selectedRT;
    @track selectedType;
    @track isEmpty = false;
    @track error;
    controlValues;
    totalDependentValues = [];

    handleRTChange(event) {
        // Selected Country Value
        this.selectedRT = event.target.value;
        this.isEmpty = false;
        let dependValues = [];

        if(this.selectedRT) {
            // if Selected country is none returns nothing
            if(this.selectedRT === '--None--') {
                this.isEmpty = true;
                dependValues = [{label:'--None--', value:'--None--'}];
                this.selectedRT = null;
                this.selectedState = null;
                return;
            }
            console.log(this.selectedRT);
            if(this.selectedRT === 'Collection Request'){
                dependValues.push({
                    label: 'Repossession',
                    value: 'Repossession'
                })
                dependValues.push({
                    label: 'Field Call',
                    value: 'FieldCall'
                })
                dependValues.push({
                    label: 'Assist Field Call',
                    value: 'Assist Field Call'
                })
                dependValues.push({
                    label: 'Legal',
                    value: 'Legal'
                })
                dependValues.push({
                    label: 'Voluntary Surrender',
                    value: 'Voluntary Surrender'
                }) 
                this.selectedType = 'Repossession';
            }

            if(this.selectedRT === 'Insolvency Request'){
                dependValues.push({
                    label: 'Liquidation',
                    value: 'Liquidation'
                })
                dependValues.push({
                    label: 'Administration',
                    value: 'Administration'
                })
                dependValues.push({
                    label: 'Receivers and Managers',
                    value: 'Receivers and Managers'
                })
                dependValues.push({
                    label: 'Receivers',
                    value: 'Receivers'
                })
                this.selectedType = 'Liquidation';
            }

            this.dependentValues = dependValues; 
        }
    }

    get options() {
        return [
            { label: 'Collection Request', value: 'Collection Request' },
            { label: 'Insolvency Request', value: 'Insolvency Request' },
        ];
    }

    handleStateChange(event) {
        this.selectedState = event.target.value;
    }
    
    connectedCallback() {
        console.log(this.selectedRT);
        let dependValues = [];
        this.selectedRT ='Collection Request';
        if(this.selectedRT === 'Collection Request'){
            dependValues.push({
                label: 'Repossession',
                value: 'Repossession'
            })
            dependValues.push({
                label: 'Field Call',
                value: 'FieldCall'
            })
            dependValues.push({
                label: 'Assist Field Call',
                value: 'Assist Field Call'
            })
            dependValues.push({
                label: 'Legal',
                value: 'Legal'
            })
            dependValues.push({
                label: 'Voluntary Surrender',
                value: 'Voluntary Surrender'
            }) 
            this.dependentValues = dependValues; 
            this.selectedType = 'Repossession';
        }

    }

    populatedependentPicklist(){
        this.selectedRT ='Collection Request';
        let dependValues = [];

        if(this.selectedRT) {
            // if Selected country is none returns nothing
            if(this.selectedRT === '--None--') {
                this.isEmpty = true;
                dependValues = [{label:'--None--', value:'--None--'}];
                this.selectedRT = null;
                this.selectedState = null;
                return;
            }
            console.log(this.selectedRT);
            if(this.selectedRT === 'Collection Request'){
                dependValues.push({
                    label: 'Repossession',
                    value: 'Repossession'
                })
                dependValues.push({
                    label: 'Field Call',
                    value: 'FieldCall'
                })
                dependValues.push({
                    label: 'Assist Field Call',
                    value: 'Assist Field Call'
                })
                dependValues.push({
                    label: 'Legal',
                    value: 'Legal'
                })
                dependValues.push({
                    label: 'Voluntary Surrender',
                    value: 'Voluntary Surrender'
                }) 
                this.selectedType = 'Repossession';
            }

            if(this.selectedRT === 'Insolvency Request'){
                dependValues.push({
                    label: 'Liquidation',
                    value: 'Liquidation'
                })
                dependValues.push({
                    label: 'Administration',
                    value: 'Administration'
                })
                dependValues.push({
                    label: 'Receivers and Managers',
                    value: 'Receivers and Managers'
                })
                dependValues.push({
                    label: 'Receivers',
                    value: 'Receivers'
                })
                this.selectedType = 'Liquidation';
            }

            this.dependentValues = dependValues; 
        }
    }

    @wire(collectGeneralDependency)
    setPicklistData({data,err}){
        if(data){
            this.PriorityOptions=data.Case_PriorityPicklistValues;
            this.StatusOptions=data.Case_StatusPicklistValues;
            this.LoanTypeOptions=data.Loan_TypePicklistValues;
            this.LoanInstallmentFrequencyOptions=data.Loan_InstallmentFrequencyPicklistValues;
            this.LoanIntrestTypeOptions=data.Loan_IntrestTypePicklistValues;
            this.LoanContactRoleOptions=data.LoanContact_RolePicklistValues;
            this.TypeOptions=data.Case_TypePicklistValues;
            this.AssetRecordTypeOptions=data.Asset_RecordTypePicklistValues
        }else if(err){
            alert(err);
        }
    }

    @track CaseResult;
    @track LoanData=[];

    @api caseObj={};
    @api
    validateCase(){
        let valid=false;
        let validLoan=false
        this.CaseResult={
            BorrowerAccountInformation:{},
            BorrowerContactInformation:{}
        };

        /*this.CaseResult={
            Type:null,
            Priority:null,
            Subject:null,
            Description:null,
            BorrowerAccountInformation:{
                BorrowerAccount:null,
                BorrowerAccountPhone:null,
                BorrowerAccountStreet:null,
                BorrowerAccountCity:null,
                BorrowerAccountState:null,
                BorrowerAccountPostalCode:null,
                BorrowerAccountCountry:null
            },
            BorrowerContactInformation:{
                BorrowerContactFirstName:null,
                BorrowerContactLastName:null,
                BorrowerContactEmail:null,
                BorrowerContactPhone:null,
                BorrowerContactMobile:null,
                BorrowerBirthDate:null,
                BorrowerContactStreet:null,
                BorrowerContactCity:null,
                BorrowerContactState:null,
                BorrowerContactPostalCode:null,
                BorrowerContactCountry:null
            },
            LoanData:[]
        };*/

try{
        if(typeof  this.template.querySelector('[data-id="RecordType"]').value === 'undefined'){
            valid=true;
            this.template.querySelector('[data-id="RecordType"]').setCustomValidity('Please enter Record Type ');
            this.template.querySelector('[data-id="RecordType"]').reportValidity();
            this.CaseResult.RTName=null;
        }else{
        
            this.template.querySelector('[data-id="RecordType"]').setCustomValidity('');
            this.template.querySelector('[data-id="RecordType"]').reportValidity();
            this.CaseResult.RTName=this.template.querySelector('[data-id="RecordType"]').value;
        }

        if(typeof this.template.querySelector('[data-id="Type"]').value === 'undefined'){
            valid=true;
            this.template.querySelector('[data-id="Type"]').setCustomValidity('Please enter Type ');
            this.template.querySelector('[data-id="Type"]').reportValidity();
            this.CaseResult.Type=null;
        }else{
        
            this.template.querySelector('[data-id="Type"]').setCustomValidity('');
            this.template.querySelector('[data-id="Type"]').reportValidity();
            this.CaseResult.Type=this.template.querySelector('[data-id="Type"]').value;
        }

        if(this.template.querySelector('[data-id="Priority"]')==null){
            valid=true;
            this.template.querySelector('[data-id="Priority"]').setCustomValidity('Please choose priority  ');
            this.template.querySelector('[data-id="Priority"]').reportValidity();
            this.CaseResult.Priority=null;
        }else{
        
            this.template.querySelector('[data-id="Priority"]').setCustomValidity('');
            this.template.querySelector('[data-id="Priority"]').reportValidity();
            this.CaseResult.Priority=this.template.querySelector('[data-id="Priority"]').value;
        }


        if(this.template.querySelector('[data-id="Subject"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="Subject"]').setCustomValidity('Please enter Subject ');
            this.template.querySelector('[data-id="Subject"]').reportValidity();
            this.CaseResult.Subject=null;
        }else{
        
            this.template.querySelector('[data-id="Subject"]').setCustomValidity('');
            this.template.querySelector('[data-id="Subject"]').reportValidity();
            this.CaseResult.Subject=this.template.querySelector('[data-id="Subject"]').value;
        }

        if(this.template.querySelector('[data-id="Description"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="Description"]').setCustomValidity('Please enter Description ');
            this.template.querySelector('[data-id="Description"]').reportValidity();
            this.CaseResult.Description=null;
        }else{
        
            this.template.querySelector('[data-id="Description"]').setCustomValidity('');
            this.template.querySelector('[data-id="Description"]').reportValidity();
            this.CaseResult.Description=this.template.querySelector('[data-id="Description"]').value;
        }

        if(!this.template.querySelector('[data-id="BorrowerAccountLookup"]').checkValidity()){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountLookup"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountLookup"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountLookup = null;
        }else{
            this.template.querySelector('[data-id="BorrowerAccountLookup"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountLookup"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountLookup = this.template.querySelector('[data-id="BorrowerAccountLookup"]').getRecordId();
        }

        if(this.template.querySelector('[data-id="BorrowerAccount"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="BorrowerAccount"]').setCustomValidity('Please enter Borrower Account Name ');
            this.template.querySelector('[data-id="BorrowerAccount"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccount=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccount"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccount"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccount=this.template.querySelector('[data-id="BorrowerAccount"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountPhone"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountPhone"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountPhone=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountPhone"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountPhone=this.template.querySelector('[data-id="BorrowerAccountPhone"]').value;
        }

        console.log(' 1 ' + this.template.querySelector('[data-id="BorrowerAccountABN"]').value);
        if(this.template.querySelector('[data-id="BorrowerAccountABN"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountABN"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountABN"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountABN=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountABN"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountABN"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountABN=this.template.querySelector('[data-id="BorrowerAccountABN"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountACN"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountACN"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountACN"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountACN=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountACN"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountACN"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountACN=this.template.querySelector('[data-id="BorrowerAccountACN"]').value;
        }
        
        if(this.template.querySelector('[data-id="BorrowerAccountStreet"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountStreet"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountStreet=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountStreet"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountStreet=this.template.querySelector('[data-id="BorrowerAccountStreet"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountCity"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountCity"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountCity=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountCity"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountCity=this.template.querySelector('[data-id="BorrowerAccountCity"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountState"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountState"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountState=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountState"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountState=this.template.querySelector('[data-id="BorrowerAccountState"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountPostalCode"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountState"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountPostalCode=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountPostalCode"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountPostalCode=this.template.querySelector('[data-id="BorrowerAccountPostalCode"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerAccountCountry"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerAccountCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountCountry"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountCountry=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerAccountCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerAccountCountry"]').reportValidity();
            this.CaseResult.BorrowerAccountInformation.BorrowerAccountCountry=this.template.querySelector('[data-id="BorrowerAccountCountry"]').value;
        }

        if(!this.template.querySelector('[data-id="BorrowerContactLookup"]').checkValidity()){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactLookup"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactLookup"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactLookup = null;
        }else{
            this.template.querySelector('[data-id="BorrowerContactLookup"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactLookup"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactLookup = this.template.querySelector('[data-id="BorrowerContactLookup"]').getRecordId();
        }

        
        if(this.template.querySelector('[data-id="BorrowerContactFirstName"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactFirstName=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactFirstName=this.template.querySelector('[data-id="BorrowerContactFirstName"]').value;
        }


        if(this.template.querySelector('[data-id="BorrowerContactLastName"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="BorrowerContactLastName"]').setCustomValidity('Please enter Borrower Contact LastName ');
            this.template.querySelector('[data-id="BorrowerContactLastName"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactLastName=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactLastName"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactLastName"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactLastName=this.template.querySelector('[data-id="BorrowerContactLastName"]').value;
        }
        
        if(this.template.querySelector('[data-id="BorrowerContactEmail"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactEmail"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactEmail"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactEmail=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactEmail"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactEmail"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactEmail=this.template.querySelector('[data-id="BorrowerContactEmail"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactPhone"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPhone"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactPhone=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPhone"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactPhone=this.template.querySelector('[data-id="BorrowerContactPhone"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactMobile"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactMobile"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactMobile"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactMobile=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactMobile"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactMobile"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactMobile=this.template.querySelector('[data-id="BorrowerContactMobile"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerBirthDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerBirthDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerBirthDate"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerBirthDate=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerBirthDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerBirthDate"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerBirthDate=this.template.querySelector('[data-id="BorrowerBirthDate"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactStreet"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactStreet"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactStreet=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactStreet"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactStreet=this.template.querySelector('[data-id="BorrowerContactStreet"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactCity"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactCity=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactCity=this.template.querySelector('[data-id="BorrowerContactCity"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactState"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactState=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactState"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactState=this.template.querySelector('[data-id="BorrowerContactState"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactPostalCode"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactPostalCode=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactPostalCode=this.template.querySelector('[data-id="BorrowerContactPostalCode"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactCountry"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCountry"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactCountry=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCountry"]').reportValidity();
            this.CaseResult.BorrowerContactInformation.BorrowerContactCountry=this.template.querySelector('[data-id="BorrowerContactCountry"]').value;
        }

    }catch(e){
        alert(e);
    }
        this.LoanData=[];
        this.CaseResult.LoanData=[];
//alert('>>'+this.LoanArr.length);
        this.LoanArr.forEach(Element=>{
            validLoan=this.template.querySelector('[data-id="'+Element.LoanId+'"]').validateLoanData();
            this.LoanData.push(this.template.querySelector('[data-id="'+Element.LoanId+'"]').collectLoanData());
        });
        this.CaseResult.LoanData=this.LoanData;

        if(!validLoan && !valid){
            return false;
        }
        return true;
      

    }
    @api 
    collectCaseDetails(){
        return this.CaseResult;
    }

    populateDetails(event){
        let AssetId=event.detail;
        console.log('Event details ' + AssetId);
        getSObjectDetails({'recordId':AssetId})
        .then(suc=>{
            //alert(suc);
            this.accountName   = suc.Name;
            this.accountPhone  = suc.Phone;
            this.accountStreet = suc.BillingStreet;
            this.accountCity   = suc.BillingCity;
            this.accountState  = suc.BillingState;
            this.accountPostalCode = suc.BillingPostalCode;
            this.accountCountry = suc.BillingCountry;
            this.accountABN     = suc.ABN__c;
            this.accountACN     = suc.ACN__c;
        })
        .catch(err=>{
            console.log(err);
        });
    }

    populateContactDetails(event){
        let AssetId=event.detail;
        console.log('Event details ' + AssetId);

        getContactDetails({'recordId':AssetId})
        .then(suc=>{
            //alert(suc);
            this.contactFirstName  = suc.FirstName;
            this.contactLastName   = suc.LastName;
            this.contactPhone      = suc.Phone;
            this.contactEmail      = suc.Email;
            this.contactBirthdate  = suc.Birthdate;
            this.contactMobilePhone= suc.MobilePhone;
            this.contactStreet     = suc.MailingStreet;
            this.contactCity       = suc.MailingCity;
            this.contactState      = suc.MailingState;
            this.contactPostalCode = suc.MailingPostalCode;
            this.contactCountry    = suc.MailingCountry;
        })
        .catch(err=>{
            console.log(err);
        });
        this.handleContactData();
    }

    createNewLoan(){
        let data={
            LoanId:'Loan-'+this.LoanCount,
            LoanName:'Loan No '+this.LoanCount
        }
        this.LoanArr.push(data);
        this.LoanCount++;
        this.blur();
    }
    
    handleSubjectChange(evt) {
        /*if(this.template.querySelector('[data-id="Subject"]').value!=''){
            // Fire the event from c-tile
            this.subject = this.template.querySelector('[data-id="Subject"]').value;
            this.dispatchEvent(new CustomEvent('subject',{'detail':this.template.querySelector('[data-id="Subject"]').value}));
        }*/
        console.log('Current value of the input: ' + evt.target.value);
        this.subject = evt.target.value;
    }

    deleteLoan(event){
        let loanId=event.detail;
        let ArrData=[];
        this.LoanArr.forEach(Element=>{
            if(Element.LoanId!=loanId){
                ArrData.push(Element);
            }
        });
        this.LoanArr=ArrData;
    }

    @track goData;
    @track goBol=false;

    handleContactData(){
        try{

        
            let BorrowerContact=this.template.querySelector('[data-id="BorrowerContactLookup"]').selectedRecord;
            let ContactFirstName=this.template.querySelector('[data-id="BorrowerContactFirstName"]').value;
            let ContactLastName=this.template.querySelector('[data-id="BorrowerContactLastName"]').value;

            if(BorrowerContact==null && ContactLastName!=null &&  ContactLastName.trim()!='' ){
                this.goData={'Name':(ContactFirstName==null?'':ContactFirstName.trim())+' '+ContactLastName.trim(), 'Id':'TEMPID'};
                this.goBol=true;
            }else{
                this.goData=null;
                this.goBol=false;
            }
        }catch(e){
            alert(e);
        }
    }

    /*
    @api acc={'Name':''};
    @api
    validateAccount(){
        try{
            let validate=true;
            let AccountName=this.template.querySelector('[data-id="AccountName"]');
            if(AccountName.value!=undefined && AccountName.value.trim().length!=0){
                validate=true;
                AccountName.className=AccountName.className.replace('slds-has-error','');
            }else{
                validate=false;
                AccountName.className+=' slds-has-error';
            }
            if(validate){
                AccountName.className=AccountName.className.replace('slds-has-error','');
                this.acc.Name=AccountName.value.trim();
            }
            return validate;
        }catch(ex){
            alert(ex);
            return false;
        }
    }
    */
}