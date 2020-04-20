public inherited sharing class LWCCustomFileUploader {
    
    @AuraEnabled
    public static ContentVersion saveFile(Id idParent, String strFileName, String subject, String base64Data, List<String> fileNamesList, List<String> base64DataList) {
        
        List<ContentVersion> cvToInsertList = new List<ContentVersion>();

        for(Integer i=0; i< base64DataList.size(); i++){
            System.debug(base64DataList[i]);
            // Decoding base64Data
            String base64Data1 = EncodingUtil.urlDecode(base64DataList[i], 'UTF-8');
            //System.debug(base64Data1);
            // inserting file
            ContentVersion cv = new ContentVersion();
            cv.Title = fileNamesList[i];
            cv.PathOnClient = '/' + fileNamesList[i];
            cv.FirstPublishLocationId = idParent;

            //String KeyString = EncodingUtil.base64Encode(Blob.valueOf(base64DataList[i]));
            try{
                cv.VersionData = EncodingUtil.base64Decode(base64Data1);
                cv.IsMajorVersion = true;
                cv.Description = subject;
                
                cvToInsertList.add(cv);
            } catch(Exception e){
                System.debug(e);
                continue;
            }
            
        }
        
        Insert cvToInsertList;
        return null;
    }

    @AuraEnabled
    public static list<contentversion> releatedFiles(Id idParent){
        list<id> lstConDocs = new list<id>();
        for(ContentDocumentLink cntLink : [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:idParent]) {
            lstConDocs.add(cntLink.ContentDocumentId);
        }
        if(!lstConDocs.isEmpty()) {
            return [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :lstConDocs];
        }
        else {
            return null;
        }
     
    }
    
}