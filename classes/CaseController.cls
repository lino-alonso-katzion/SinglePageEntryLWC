public with sharing class CaseController {
    
    public class GeneralWrapper{
        @AuraEnabled public List<Object> Case_PriorityPicklistValues;
        @AuraEnabled public List<Object> Case_StatusPicklistValues;
        @AuraEnabled public List<Object> Case_TypePicklistValues;
        @AuraEnabled public List<Object> Loan_TypePicklistValues;
        @AuraEnabled public List<Object> Loan_InstallmentFrequencyPicklistValues;
        @AuraEnabled public List<Object> Loan_IntrestTypePicklistValues;
        @AuraEnabled public List<Object> LoanContact_RolePicklistValues;
        @AuraEnabled public List<Object> Asset_RecordTypePicklistValues;
        public GeneralWrapper(){
            Case_PriorityPicklistValues=new List<Object>();
            Case_StatusPicklistValues=new List<Object>();
            Case_TypePicklistValues=new List<Object>();
            Loan_TypePicklistValues=new List<Object>();
            Loan_InstallmentFrequencyPicklistValues=new List<Object>();
            Loan_IntrestTypePicklistValues=new List<Object>();
            LoanContact_RolePicklistValues=new List<object>();
            Asset_RecordTypePicklistValues=new List<object>();
        }
    }

    @AuraEnabled(cacheable=true)
    public static GeneralWrapper collectGeneralDependency(){
        try{
            GeneralWrapper Gen_Wrapper=new GeneralWrapper();
            Gen_Wrapper.Case_PriorityPicklistValues.addAll((List<Object>)populatePicklistValues('case','priority'));
            Gen_Wrapper.Case_TypePicklistValues.addAll((List<Object>)populatePicklistValues('case','type'));
            Gen_Wrapper.Case_StatusPicklistValues.addAll((List<Object>)populatePicklistValues('case','status'));
            Gen_Wrapper.Loan_TypePicklistValues.addAll((List<Object>)populatePicklistValues('SA_Loan__c','SA_Type__c'));
            Gen_Wrapper.Loan_InstallmentFrequencyPicklistValues.addAll((List<Object>)populatePicklistValues('SA_Loan__c','SA_Installment_Frequency__c'));
            Gen_Wrapper.Loan_IntrestTypePicklistValues.addAll((List<Object>)populatePicklistValues('SA_Loan__c','SA_Interest_Type__c'));
            Gen_Wrapper.LoanContact_RolePicklistValues.addAll((List<Object>)populatePicklistValues('Loan_Contact__c','Role__c'));
            Gen_Wrapper.Asset_RecordTypePicklistValues.addAll((List<Object>)populateRecordtypeValues('Asset'));
            return Gen_Wrapper;
        }catch(Exception ex){
            System.debug(ex);
            System.debug(ex.getMessage());
            System.debug(ex.getLineNumber());
        }
        return new GeneralWrapper();
    }

    public static List<Object> populateRecordtypeValues(String objName){
        try{
            List<Object> PicklistLIst=new List<Object>();
            Schema.SObjectType objType=Schema.getGlobalDescribe().get(objName);
            for(Schema.RecordTypeInfo RT: objType.getDescribe().getRecordTypeInfos()){
                if(RT.isActive()){
                    System.debug(RT);
                    PicklistLIst.add(convertRecordTypeValue(RT.recordtypeid,RT.Name));
                }
            }
            return PicklistLIst;
        }catch(Exception ex){
            System.debug(ex);
            System.debug(ex.getMessage());
            System.debug(ex.getLineNumber());
        }
        return new List<Object>();
    }

    public static List<Object> populatePicklistValues(String objName,String PicklistFieldName){
        try{
            List<Object> PicklistLIst=new List<Object>();
            Schema.SObjectType objType=Schema.getGlobalDescribe().get(objName);
            SObjectField fieldName=objType.getDescribe().fields.getMap().get(PicklistFieldName);
            for(Schema.PicklistEntry PickList:fieldName.getDescribe().getPicklistValues()){
                if(PickList.isActive()){
                    PicklistLIst.add(convertValue(PickList.getValue()));
                }
            }
            return PicklistLIst;
        }catch(Exception ex){
            System.debug(ex);
            System.debug(ex.getMessage());
            System.debug(ex.getLineNumber());
        }
        return new List<Object>();
    }

    public static Object convertValue(String Data){
        Map<String,String> mapObj=new Map<String,String>();
        mapObj.put('value',Data);
        mapObj.put('label',Data);
        return (Object) mapObj;
    }

    public static Object convertRecordTypeValue(String dataId,String Name){
        Map<String,String> mapObj=new Map<String,String>();
        mapObj.put('value',dataId);
        mapObj.put('label',Name);
        return (Object) mapObj;
    }

    @AuraEnabled
    public static String  saveCaseDetails(String Payload){
        System.debug('Received Payload  ---> ' + Payload);
        return SinglePageDataController.processReceivedPayload(Payload);
    }

    @AuraEnabled
    public static String  saveContactDetails(String Payload){
        System.debug('Received Payload  ---> ' + Payload);
        return SinglePageDataController.createContact(Payload);
    }

    @AuraEnabled
    public static SObject  getSObjectDetails(String recordId){
        System.debug('Received Payload  ---> ' + recordId);
        List<Account> accountDetailsList = [SELECT Id, Name, Phone, BillingStreet,
                                                   BillingCity, BillingState, BillingPostalCode,
                                                   BillingCountry, ABN__c, ACN__c
                                            FROM Account
                                            WHERE Id =: recordId];
        if(accountDetailsList.size() != 0){
            return accountDetailsList[0];
        }

        return null;
    }

    @AuraEnabled
    public static SObject getContactDetails(String recordId){
        System.debug('Received Payload  ---> ' + recordId);
        List<Contact> contactDetailsList = [SELECT Id, Name, Phone, MailingStreet,
                                                   MailingCity, MailingState, MailingPostalCode,
                                                   MailingCountry, FirstName, LastName, Email,
                                                   MobilePhone, Birthdate
                                            FROM Contact
                                            WHERE Id =: recordId];
        if(contactDetailsList.size() != 0){
            return contactDetailsList[0];
        }

        return null;
    }
}