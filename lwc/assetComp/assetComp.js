import { LightningElement,api,track } from 'lwc';

export default class AssetComp extends LightningElement {
    @api asset;
    @track assetResult;
    @api assetRecordTypeOptions=[];
    
    deleteComp(){
        this.dispatchEvent(new CustomEvent('removeasset',{'detail':this.asset.AssetId}));
    }
    
    @api 
    collectAssetData(){
        return this.assetResult;
    }
    @api validateAssetData(){
        this.assetResult={};
        let valid=false;
        if(this.template.querySelector('[data-id="AssetName"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="AssetName"]').setCustomValidity('Please enter a valid Asset Name');
            this.template.querySelector('[data-id="AssetName"]').reportValidity();
            this.assetResult.Name=null;
        }else{
            this.assetResult.Name=this.template.querySelector('[data-id="AssetName"]').value;
            this.template.querySelector('[data-id="AssetName"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetName"]').reportValidity();
        }
        
        if(this.template.querySelector('[data-id="AssetVIN"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="AssetVIN"]').setCustomValidity('Please enter a valid VIN');
            this.template.querySelector('[data-id="AssetVIN"]').reportValidity();
            this.assetResult.VIN__c=null;
        }else{
            this.assetResult.VIN__c=this.template.querySelector('[data-id="AssetVIN"]').value;
            this.template.querySelector('[data-id="AssetVIN"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetVIN"]').reportValidity(); 
        }

        if(this.template.querySelector('[data-id="AssetRegistrationNo"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="AssetRegistrationNo"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetRegistrationNo"]').reportValidity();
            this.assetResult.Registration_Number__c=null;
        }else{
            this.assetResult.Registration_Number__c=this.template.querySelector('[data-id="AssetRegistrationNo"]').value;
            this.template.querySelector('[data-id="AssetRegistrationNo"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetRegistrationNo"]').reportValidity();
        }


        if(this.template.querySelector('[data-id="AssetEngineNo"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="AssetEngineNo"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetEngineNo"]').reportValidity();
            this.assetResult.Engine_Number__c=null;
        }else{
            this.assetResult.Engine_Number__c=this.template.querySelector('[data-id="AssetEngineNo"]').value;
            this.template.querySelector('[data-id="AssetEngineNo"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetEngineNo"]').reportValidity();
        }

        if(this.template.querySelector('[data-id="AssetBuildDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="AssetBuildDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetBuildDate"]').reportValidity();
            this.assetResult.Build_Date__c=null;
        }else{
            this.assetResult.Build_Date__c=this.template.querySelector('[data-id="AssetBuildDate"]').value;
            this.template.querySelector('[data-id="AssetBuildDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetBuildDate"]').reportValidity();
        }

        if(this.template.querySelector('[data-id="AssetColour"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="AssetColour"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetColour"]').reportValidity();
            this.assetResult.Colour__c=null;
        }else{
            this.assetResult.Colour__c=this.template.querySelector('[data-id="AssetColour"]').value;
            this.template.querySelector('[data-id="AssetColour"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetColour"]').reportValidity();
        }
        
        if(this.template.querySelector('[data-id="AssetRecordType"]').value==null || this.template.querySelector('[data-id="AssetRecordType"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="AssetRecordType"]').setCustomValidity('Please choose Recordtype');
            this.template.querySelector('[data-id="AssetRecordType"]').reportValidity();
            this.assetResult.RecordType=null;
        }else{
            this.assetResult.RecordType=this.template.querySelector('[data-id="AssetRecordType"]').value;
            this.template.querySelector('[data-id="AssetRecordType"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetRecordType"]').reportValidity();
        }
        
        if(this.template.querySelector('[data-id="AssetDescription"]').value==null || this.template.querySelector('[data-id="AssetDescription"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="AssetDescription"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetDescription"]').reportValidity();
            this.assetResult.Description=null;
        }else{
            this.assetResult.Description=this.template.querySelector('[data-id="AssetDescription"]').value;
            this.template.querySelector('[data-id="AssetDescription"]').setCustomValidity('');
            this.template.querySelector('[data-id="AssetDescription"]').reportValidity();
        }
        
        if(!valid){
            //alert(JSON.stringify(this.assetResult));
        }else{
            //this.assetResult=null;
        }
        return valid;
    }

}