import { LightningElement,api,track } from 'lwc';

export default class LoanComp extends LightningElement {
    @api loanTypeOptions=[];
    @api loanInstallmentFrequencyOptions=[];
    @api loanIntrestTypeOptions=[];
    @api loanContactRoleOptions=[];
    @api assetRecordTypeOptions=[];
    @api loanRec;

    @api goData;
    @api goBol=false;

    @track lType='Consumer';
    @track lInstallmentFrequency='Monthly';
    @track lInterestType='Fixed';

    

    @track LoanContactArr=[];
    @track AssetArr=[];

    @track LoanContactCount=1;
    @track AssetCount=1;

    @track LoanResult;
    @track LoanContactResult=[];
    @track AssetResult=[];


    @api 
    collectLoanData(){
        return this.LoanResult;
    }
    @api validateLoanData(){
        let valid=false;
        let validLoanContact=false;
        let validAsset=false;
        this.LoanResult={};
        /*this.LoanResult={
            Name:null,
            SA_Type__c:null,
            Client_Account__c:null,
            SA_Account__c:null,
            DefaultNoticeExpiryDate__c:null,
            SA_Account_Balance__c:null,
            SA_Amount_Due_Outstanding_Amount__c:null,
            SA_Contract_Date__c:null,
            SA_Current_Arrears__c:null,
            SA_Current_Payout__c:null,
            SA_Installment_Frequency__c:null,
            SA_Installment_Amount__c:null,
            SA_Interest_Type__c:null,
            SA_Installment_Start_Date__c:null,
            SA_Maturity_Date__c:null,
            SA_Loan_Amount__c:null,
            SA_Rate_of_Interest__c:null,
            SA_Payout_Due_Date__c:null,
            LastInstalmentAmount__c:null,
            LastInstalmentPaid__c:null,
        };*/





        if(this.template.querySelector('[data-id="LoanNumber"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="LoanNumber"]').setCustomValidity('Please enter Loan Number');
            this.template.querySelector('[data-id="LoanNumber"]').reportValidity();
            this.LoanResult.Name=null;
        }else{
        
            this.template.querySelector('[data-id="LoanNumber"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanNumber"]').reportValidity();
            this.LoanResult.Name=this.template.querySelector('[data-id="LoanNumber"]').value;
        }
        
        //console.log(valid);
        if(typeof  this.template.querySelector('[data-id="LoanType"]').value === 'undefined'){
            valid=true;
            this.template.querySelector('[data-id="LoanType"]').setCustomValidity('Please choose Loan type');
            this.template.querySelector('[data-id="LoanType"]').reportValidity();
            this.LoanResult.SA_Type__c=null;
        }else{
            
            this.template.querySelector('[data-id="LoanType"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanType"]').reportValidity();
            this.LoanResult.SA_Type__c=this.template.querySelector('[data-id="LoanType"]').value;
        }
        /*
        if(!this.template.querySelector('[data-id="LoanCustomer"]').checkValidity()){
            //valid=true;
            this.template.querySelector('[data-id="LoanCustomer"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCustomer"]').reportValidity();
            this.LoanResult.Client_Account__c=null;
        }else{
            this.template.querySelector('[data-id="LoanCustomer"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCustomer"]').reportValidity();
            this.LoanResult.Client_Account__c=this.template.querySelector('[data-id="LoanCustomer"]').getRecordId();
        }*/

        if(!this.template.querySelector('[data-id="LoanLender"]').checkValidity()){
            valid=true;
            this.template.querySelector('[data-id="LoanLender"]').setCustomValidity('Please Select Lender');
            this.template.querySelector('[data-id="LoanLender"]').reportValidity();
            this.LoanResult.SA_Account__c=null;
        }else{
            this.template.querySelector('[data-id="LoanLender"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanLender"]').reportValidity();
            this.LoanResult.SA_Account__c=this.template.querySelector('[data-id="LoanLender"]').getRecordId();
        }

        
        if(this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').reportValidity();
            this.LoanResult.DefaultNoticeExpiryDate__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').reportValidity();
            this.LoanResult.DefaultNoticeExpiryDate__c=this.template.querySelector('[data-id="LoanDefaultNotifyExpiryDate"]').value;
        }
        
        if(this.template.querySelector('[data-id="LoanAccountBalance"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanAccountBalance"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAccountBalance"]').reportValidity();
            this.LoanResult.SA_Account_Balance__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanAccountBalance"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAccountBalance"]').reportValidity();
            this.LoanResult.SA_Account_Balance__c=this.template.querySelector('[data-id="LoanAccountBalance"]').value;
        }

        if(this.template.querySelector('[data-id="LoanAccountDue"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanAccountDue"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAccountDue"]').reportValidity();
            this.LoanResult.SA_Amount_Due_Outstanding_Amount__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanAccountDue"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAccountDue"]').reportValidity();
            this.LoanResult.SA_Amount_Due_Outstanding_Amount__c=this.template.querySelector('[data-id="LoanAccountDue"]').value;
        }

        if(this.template.querySelector('[data-id="LoanContractDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanContractDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanContractDate"]').reportValidity();
            this.LoanResult.SA_Contract_Date__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanAccountDue"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAccountDue"]').reportValidity();
            this.LoanResult.SA_Contract_Date__c=this.template.querySelector('[data-id="LoanContractDate"]').value;
        }
        
        if(this.template.querySelector('[data-id="LoanCurrentArrears"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanCurrentArrears"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCurrentArrears"]').reportValidity();
            this.LoanResult.SA_Current_Arrears__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanCurrentArrears"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCurrentArrears"]').reportValidity();
            this.LoanResult.SA_Current_Arrears__c=this.template.querySelector('[data-id="LoanCurrentArrears"]').value;
        }

        if(this.template.querySelector('[data-id="LoanCurrentPayout"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanCurrentPayout"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCurrentPayout"]').reportValidity();
            this.LoanResult.SA_Current_Payout__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanCurrentPayout"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanCurrentPayout"]').reportValidity();
            this.LoanResult.SA_Current_Payout__c=this.template.querySelector('[data-id="LoanCurrentPayout"]').value;
        }

        if(this.template.querySelector('[data-id="LoanInstallmentFrequency"]')==null){
            //valid=true;
            this.template.querySelector('[data-id="LoanInstallmentFrequency"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInstallmentFrequency"]').reportValidity();
            this.LoanResult.SA_Installment_Frequency__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanInstallmentFrequency"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInstallmentFrequency"]').reportValidity();
            this.LoanResult.SA_Installment_Frequency__c=this.template.querySelector('[data-id="LoanInstallmentFrequency"]').value;
        }

        if(this.template.querySelector('[data-id="LoanInstallmentAmount"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanInstallmentAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInstallmentAmount"]').reportValidity();
            this.LoanResult.SA_Installment_Amount__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanInstallmentAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInstallmentAmount"]').reportValidity();
            this.LoanResult.SA_Installment_Amount__c=this.template.querySelector('[data-id="LoanInstallmentAmount"]').value;
        }
        
        if(this.template.querySelector('[data-id="LoanInterestType"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanInterestType"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInterestType"]').reportValidity();
            this.LoanResult.SA_Interest_Type__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanInterestType"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanInterestType"]').reportValidity();
            this.LoanResult.SA_Interest_Type__c=this.template.querySelector('[data-id="LoanInterestType"]').value;
        }

        if(this.template.querySelector('[data-id="LoanNextInstallmentDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanNextInstallmentDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanNextInstallmentDate"]').reportValidity();
            this.LoanResult.SA_Installment_Start_Date__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanNextInstallmentDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanNextInstallmentDate"]').reportValidity();
            this.LoanResult.SA_Installment_Start_Date__c=this.template.querySelector('[data-id="LoanNextInstallmentDate"]').value;
        }

        if(this.template.querySelector('[data-id="LoanMaturityDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanMaturityDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanMaturityDate"]').reportValidity();
            this.LoanResult.SA_Maturity_Date__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanMaturityDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanMaturityDate"]').reportValidity();
            this.LoanResult.SA_Maturity_Date__c=this.template.querySelector('[data-id="LoanMaturityDate"]').value;
        }

        if(this.template.querySelector('[data-id="LoanAmount"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAmount"]').reportValidity();
            this.LoanResult.SA_Loan_Amount__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanAmount"]').reportValidity();
            this.LoanResult.SA_Loan_Amount__c=this.template.querySelector('[data-id="LoanAmount"]').value;
        }

        if(this.template.querySelector('[data-id="LoanRateofInterest"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanRateofInterest"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanRateofInterest"]').reportValidity();
            this.LoanResult.SA_Rate_of_Interest__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanRateofInterest"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanRateofInterest"]').reportValidity();
            this.LoanResult.SA_Rate_of_Interest__c=this.template.querySelector('[data-id="LoanRateofInterest"]').value;
        }

        if(this.template.querySelector('[data-id="LoanPayoutDueDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanPayoutDueDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanPayoutDueDate"]').reportValidity();
            this.LoanResult.SA_Payout_Due_Date__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanPayoutDueDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanPayoutDueDate"]').reportValidity();
            this.LoanResult.SA_Payout_Due_Date__c=this.template.querySelector('[data-id="LoanPayoutDueDate"]').value;
        }

        if(this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').reportValidity();
            this.LoanResult.LastInstalmentAmount__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').reportValidity();
            this.LoanResult.LastInstalmentAmount__c=this.template.querySelector('[data-id="LoanLastInstalmentAmount"]').value;
        }

        if(this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').reportValidity();
            this.LoanResult.LastInstalmentPaid__c=null;
        }else{
        
            this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').setCustomValidity('');
            this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').reportValidity();
            this.LoanResult.LastInstalmentPaid__c=this.template.querySelector('[data-id="LoanLastInstalmentPaid"]').value;
        }
        

        this.LoanContactResult=[];
        this.LoanResult.LoanContactData=[];
        this.LoanResult.AssetData=[];

        this.LoanContactArr.forEach(Element=>{
            validLoanContact=this.template.querySelector('[data-id="'+Element.LoanContactId+'"]').validateLoanContactData();
            this.LoanContactResult.push(this.template.querySelector('[data-id="'+Element.LoanContactId+'"]').collectLoanContactData());
        });
        this.AssetResult=[];
        this.AssetArr.forEach(Element=>{
            
            validAsset=this.template.querySelector('[data-id="'+Element.AssetId+'"]').validateAssetData();
            this.AssetResult.push(this.template.querySelector('[data-id="'+Element.AssetId+'"]').collectAssetData());
        });
        
        this.LoanResult.LoanContactData=this.LoanContactResult;
        this.LoanResult.AssetData=this.AssetResult;

        if(!validAsset && !validLoanContact && !valid){
            return false;
        }
        return true;
    

    }

    createNewLoanContact(){
        let data={
            LoanContactId:'LoanContact-'+this.LoanContactCount,
            LoanContactName:'Loan Contact No '+this.LoanContactCount
        }
        this.LoanContactArr.push(data);
        this.LoanContactCount++;
    }
    deleteLoanContact(event){
        let loanContactId=event.detail;
        let ArrData=[];
        this.LoanContactArr.forEach(Element=>{
            if(Element.LoanContactId!==loanContactId){
                ArrData.push(Element);
            }
        });
        this.LoanContactArr=ArrData;
    }

    createNewAsset(){
        let data={
            AssetId:'Asset-'+this.AssetCount,
            AssetName:'Asset No '+this.AssetCount
           
        }
        this.AssetArr.push(data);
        this.AssetCount++;
    }
    deleteAsset(event){
        let AssetId=event.detail;
        let ArrData=[];
        this.AssetArr.forEach(Element=>{
            if(Element.AssetId!==AssetId){
                ArrData.push(Element);
            }
        });
        this.AssetArr=ArrData;
    }
    deleteComp(){
        this.dispatchEvent(new CustomEvent('removeloan',{'detail':this.loanRec.LoanId}));
    }

}