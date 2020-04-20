public with sharing class LookupController {
    @AuraEnabled(cacheable=true)
    public static List<object> lookupData(String ObjectName,String SearchText,String ObjectFilter){
        try{
            String Filter='';
            if(ObjectFilter!=null && ObjectFilter!=''){
               Filter=' AND ' +ObjectFilter.split('-')[0]+'=\''+ObjectFilter.split('-')[1]+'\'';
            }
            Filter += ' LIMIT 10';
            return Database.query('select Id,Name from '+ObjectName+' where Name like \'%'+SearchText+'%\''+Filter);
        }catch(Exception ex){
            System.debug(ex);
            System.debug(ex.getMessage());
            System.debug(ex.getLineNumber());
        }
        return new List<Object>();
    }
}