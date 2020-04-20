/**
 * SinglePageDataController containing all the methods that will be called by the 
 * Create New Case Page available on the Slattery Corporate Portal community
 */
public with sharing class SinglePageDataController {

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the JSON generated on the Create New Case page and
      *              creates all the records being enter by the users in the page.
      * @param receivedJSON String with the records that we need to create in a JSON format
    */
    public static String processReceivedPayload(String receivedJSON){
        System.debug(' receivedJSON --> ' + receivedJSON);
        
        receivedJSON = updateReceivedJSON(receivedJSON);
        SinglePageDataJSON spJSON = SinglePageDataJSON.parse(receivedJSON);

        return createData(spJSON);
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the JSON generated on the Create New Case page and
      *              creates all the data in Salesforce make sure the state of the database
      *              is rolled back in case there is any issue inserting any of the records
      * @param spJSON SinglePageDataJSON class that contains all the data that needs to be
      *               inserted.
    */
    private static String createData(SinglePageDataJSON spJSON){
        Savepoint sp = Database.setSavepoint();
        
        try{
            Id accRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Client').getRecordTypeId();
            Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get(spJSON.RTName).getRecordTypeId();

            //Create or update the borrower account first.
            Account newAccount      = spJSON.BorrowerAccountInformation;
            System.debug(spJSON.BorrowerAccountInformation);
            newAccount.RecordTypeId = accRecordTypeId;
            upsert newAccount;
            //Link new contact with the previous borrower account
            Contact newContact = spJSON.BorrowerContactInformation;
            newContact.AccountId = newAccount.Id;
            upsert newContact;
            
            Case newCase = new Case();
            newCase.Type         = spJSON.Type;
            newCase.Priority     = spJSON.Priority;
            newCase.Subject      = spJSON.Subject;
            newCase.Description  = spJSON.Description;
            newCase.RecordTypeId = caseRecordTypeId;
            newCase.Client_Account__c  = newAccount.Id;
            newCase.Client_Contact__c  = newContact.Id;
            insert newCase;

            //Link uploaded files to the newly created case
            createContentDocumentLink(newCase);

            //After inserting the account, contact and case we will create the related records
            insertRelatedRecords(spJSON, newCase.Id, newAccount.Id, newContact.Id);

            System.debug('Account ' +newAccount.Id + ' Contact ' + newContact.Id+ ' Case ' + newCase.Id);
            return newCase.Id;
            
        } 
        catch (Exception e){
            Database.rollback(sp);
            System.debug('---Exception Message:  '+e.getMessage()+' getLineNumber: '+e.getLineNumber());
            return 'Exception Message: ' + e.getMessage();
        } 
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the JSON generated on the Create New Case page and
      *              all the receords previously created and insert the list of loan contacts
      *              and assets received in the payload
      * @param spJSON SinglePageDataJSON class that contains all the data that needs to be
      *               inserted.
      * @param relatedCaseId relatedCaseId Case Id of the record previously created
      * @param accountId Id of the borrower account previously created/updated
      * @param contactId Id of the borrower contact previously created/updated
    */
    private static void insertRelatedRecords(SinglePageDataJSON spJSON, Id relatedCaseId, Id accountId, Id contactId){
        Map<String, Id> loanIdPerLoanNumberMap = getLoanIdPerLoanNumberMap(spJSON, relatedCaseId, accountId);
        Map<String, SinglePageDataJSON.LoanData> loanDataPerLoanNumberMap = getLoanDataPerLoanNumber(spJSON);
        Id loggedInAccountId = getLoggedInUserAccountId();
        List<Asset> assetsToInsertList = new List<Asset>();
        List<Loan_Contact__c> loanContactsToInsertList = new List<Loan_Contact__c>();

        for(String loanNumber: loanIdPerLoanNumberMap.keySet()){
            if(loanDataPerLoanNumberMap.containsKey(loanNumber)){
                addAssetsToInsert(assetsToInsertList, loanIdPerLoanNumberMap.get(loanNumber), loanDataPerLoanNumberMap.get(loanNumber).AssetData, relatedCaseId, loggedInAccountId);
                addLoanContactsToInsert(loanContactsToInsertList, loanIdPerLoanNumberMap.get(loanNumber), loanDataPerLoanNumberMap.get(loanNumber).LoanContactData, contactId);
            }
        }

        if(assetsToInsertList.size() != 0){
            insert assetsToInsertList;
        }

        if(loanContactsToInsertList.size() != 0){
            insert loanContactsToInsertList;
            updateNewLoanContacts(loanContactsToInsertList, accountId);
        }
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the list of loan contacts that were passed in the JSON
      *              payload and that were inserted and link them to the previously created
      *              account
      * @param loanContactsToInsertList List of loan contacts received in the JSON payload
      * @param borrowerAccountId Id of the borrower account previously created/updated
    */
    private static void updateNewLoanContacts(List<Loan_Contact__c> loanContactsToInsertList, Id borrowerAccountId){
        List<Contact> contactsToUpdateList = new List<Contact>();
        Set<Id> contactIdSet = new Set<Id>();

        for(Loan_Contact__c loanContact : loanContactsToInsertList){
            contactIdSet.add(loanContact.Contact__c);
        }

        for(Contact newContact : [SELECT Id, AccountId
                                  FROM Contact
                                  WHERE Id IN: contactIdSet
                                  AND AccountId = null]){
           newContact.AccountId = borrowerAccountId;
           contactsToUpdateList.add(newContact);
        }

        if(contactsToUpdateList.size()!=0){
            update contactsToUpdateList;
        }
        
    }

    private static Id getLoggedInUserAccountId(){
        id userId = UserInfo.getUserId();
        User u = [select id, AccountId from User where id = : userId];
        
        if(u.AccountId != null){
            return u.AccountId;
        }

        return null;
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the list of loan contacts that were passed in the JSON
      *              payload and that will be inserted and link them to the previously created
      *              loan and contacts
      * @param loanContactsToInsertList List of loan contacts received in the JSON payload
      * @param contactId Id of the borrower contact previously created/updated
      * @param relatedLoanId Id of the loan previously created/updated
      * @param loanContactDataList List of loan contacts that will be inserted
    */
    private static void addLoanContactsToInsert(List<Loan_Contact__c> loanContactsToInsertList, 
                                                Id relatedLoanId, 
                                                List<Loan_Contact__c> loanContactDataList, 
                                                Id contactId){

        for(Loan_Contact__c newLoanContact : loanContactDataList){
            newLoanContact.Contact__c = newLoanContact.Contact_Input__c == 'TEMPID' ? contactId : newLoanContact.Contact_Input__c;
            newLoanContact.Loan__c    = relatedLoanId;
            loanContactsToInsertList.add(newLoanContact);
        }
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the list of assets that were passed in the JSON
      *              payload and that will be inserted and link them to the previously created
      *              loan and case
      * @param assetsToInsertList List of assets received in the JSON payload
      * @param relatedCaseId Id of the case previously created
      * @param relatedLoanId Id of the loan previously created/updated
      * @param loanContactDataList List of assets that will be inserted
    */
    private static void addAssetsToInsert(List<Asset> assetsToInsertList, 
                                          Id relatedLoanId, 
                                          List<Asset> assetsDataList, 
                                          Id relatedCaseId,
                                          Id loggedInAccountId){

        for(Asset newAsset : assetsDataList){
            newAsset.SA_Loan__c = relatedLoanId;
            newAsset.Case__c    = relatedCaseId;
            newAsset.AccountId  = loggedInAccountId;
            assetsToInsertList.add(newAsset);
        }
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that populates a Map of newly created loan records group by its related
      *              loan number
      * @param spJSON SinglePageDataJSON class that contains all the data that needs to be
      *               inserted.
      * @return Map<String, SinglePageDataJSON.LoanData> map of loan records group by the Loan number.
    */
    private static Map<String, SinglePageDataJSON.LoanData> getLoanDataPerLoanNumber(SinglePageDataJSON spJSON){
        Map<String, SinglePageDataJSON.LoanData> loanDataPerLoanNumberMap = new Map<String, SinglePageDataJSON.LoanData>();

        for(SinglePageDataJSON.LoanData loanDT : spJSON.LoanData){
            if(loanDT.Name != null){
                loanDataPerLoanNumberMap.put(loanDT.Name, loanDT);
            } 
        }

        return loanDataPerLoanNumberMap;
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that inserts the received loan records and returns a Map
      *              with the newly created loan Ids group by their loan numbers
      * @param spJSON SinglePageDataJSON class that contains all the data that needs to be
      *               inserted.
      * @param relatedCaseId Id of the case previously created
      * @param accountId Id of the account previously created/updated
    */
    private static Map<String, Id> getLoanIdPerLoanNumberMap(SinglePageDataJSON spJSON, Id relatedCaseId, Id accountId){
        Map<String, Id> loanIdPerLoanNumberMap = new Map<String, Id>();
        List<SA_Loan__c> loansToInsertList = new List<SA_Loan__c>();

        for(SinglePageDataJSON.LoanData loanDT : spJSON.LoanData){
            if(loanDT.Name != null
               && loanDT.Name != ''){
                loansToInsertList.add(getNewLoanRecord(loanDT, relatedCaseId, accountId));
            }
            
        }

        if(loansToInsertList.size()!=0){
            insert loansToInsertList;
        }

        for(SA_Loan__c newLoan : loansToInsertList){
            loanIdPerLoanNumberMap.put(newLoan.Name, newLoan.Id);
        }

        return loanIdPerLoanNumberMap;
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that creates a new Loan record mapping the fields received in 
      *              the JSON payload with the fields on the loan object. We need to verify
      *              the value received to make sure it is converted to the right field type
      * @param loanDT Loan record sObject received in the payload
      * @param relatedCaseId Id of the case previously created
      * @param accountId Id of the account previously created/updated
    */
    private static SA_Loan__c getNewLoanRecord(SinglePageDataJSON.LoanData loanDT, Id relatedCaseId, Id accountId){
        SA_Loan__c newLoan = new SA_Loan__c();
        newLoan.Name                       = loanDT.Name;
        newLoan.Case__c                    = relatedCaseId;
        newLoan.SA_Type__c                 = loanDT.SA_Type;
        newLoan.Client_Account__c          = accountId;                           
        newLoan.SA_Account__c              = loanDT.SA_Account;
        newLoan.DefaultNoticeExpiryDate__c = loanDT.DefaultNoticeExpiryDate != null ? Date.valueOf(loanDT.DefaultNoticeExpiryDate) : null;
        newLoan.SA_Account_Balance__c      = loanDT.SA_Account_Balance      != null ? Decimal.valueOf(loanDT.SA_Account_Balance)   : null;
        newLoan.SA_Contract_Date__c        = loanDT.SA_Contract_Date        != null ? Date.valueOf(loanDT.SA_Contract_Date)        : null;
        newLoan.SA_Current_Arrears__c      = loanDT.SA_Current_Arrears      != null ? Decimal.valueOf(loanDT.SA_Current_Arrears)   : null; 
        newLoan.SA_Current_Payout__c       = loanDT.SA_Current_Payout       != null ? Decimal.valueOf(loanDT.SA_Current_Payout)    : null;
        newLoan.SA_Installment_Frequency__c= loanDT.SA_Installment_Frequency;
        newLoan.SA_Installment_Amount__c   = loanDT.SA_Installment_Amount   != null ? Decimal.valueOf(loanDT.SA_Installment_Amount): null;
        newLoan.SA_Interest_Type__c        = loanDT.SA_Interest_Type;
        newLoan.SA_Maturity_Date__c        = loanDT.SA_Maturity_Date    != null ? Date.valueOf(loanDT.SA_Maturity_Date)       : null;
        newLoan.SA_Loan_Amount__c          = loanDT.SA_Loan_Amount      != null ? Decimal.valueOf(loanDT.SA_Loan_Amount)      : null;
        newLoan.SA_Rate_of_Interest__c     = loanDT.SA_Rate_of_Interest != null ? Decimal.valueOf(loanDT.SA_Rate_of_Interest) : null;
        newLoan.SA_Payout_Due_Date__c      = loanDT.SA_Payout_Due_Date  != null ? Date.valueOf(loanDT.SA_Payout_Due_Date)     : null;
        newLoan.LastInstalmentAmount__c    = loanDT.LastInstalmentAmount!= null ? Decimal.valueOf(loanDT.LastInstalmentAmount): null;
        newLoan.LastInstalmentPaid__c      = loanDT.LastInstalmentPaid  != null ? Date.valueOf(loanDT.LastInstalmentPaid)     : null;
        newLoan.SA_Installment_Start_Date__c        = loanDT.SA_Installment_Start_Date        != null ? Date.valueOf(loanDT.SA_Installment_Start_Date)           : null;
        newLoan.SA_Amount_Due_Outstanding_Amount__c = loanDT.SA_Amount_Due_Outstanding_Amount != null ? Decimal.valueOf(loanDT.SA_Amount_Due_Outstanding_Amount) : null ;
        
        return newLoan;
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the JSON generated on the Create New Case page and
      *              updates the tags to make sure they can be converted into the related
      *              object fields.
      * @param receivedJSON JSON that contains all the data that needs to be inserted.
    */
    private static String updateReceivedJSON(String receivedJSON){
        //Map that contains the mapping between the field API Name and the received string.
        Map<String, String> mappingMap = new Map<String, String>{'SA_Type__c'        => 'SA_Type', 
                                                                 'Client_Account__c' => 'Client_Account', 
                                                                 'SA_Account__c'     => 'SA_Account',
                                                                 'DefaultNoticeExpiryDate__c' => 'DefaultNoticeExpiryDate',
                                                                 'SA_Account_Balance__c'      => 'SA_Account_Balance',
                                                                 'SA_Amount_Due_Outstanding_Amount__c'     => 'SA_Amount_Due_Outstanding_Amount',
                                                                 'SA_Contract_Date__c'        => 'SA_Contract_Date',
                                                                 'SA_Current_Arrears__c'       => 'SA_Current_Arrears',
                                                                 'SA_Current_Payout__c'        => 'SA_Current_Payout',
                                                                 'SA_Installment_Frequency__c' => 'SA_Installment_Frequency',
                                                                 'SA_Installment_Amount__c'    => 'SA_Installment_Amount',
                                                                 'SA_Interest_Type__c'         => 'SA_Interest_Type',
                                                                 'SA_Installment_Start_Date__c'=> 'SA_Installment_Start_Date',
                                                                 'SA_Maturity_Date__c'         => 'SA_Maturity_Date',
                                                                 'SA_Loan_Amount__c'           => 'SA_Loan_Amount',
                                                                 'SA_Rate_of_Interest__c'      => 'SA_Rate_of_Interest',
                                                                 'SA_Payout_Due_Date__c'       => 'SA_Payout_Due_Date',
                                                                 'LastInstalmentAmount__c'     => 'LastInstalmentAmount',
                                                                 'LastInstalmentPaid__c'       => 'LastInstalmentPaid',
                                                                 'BorrowerAccountLookup'       => 'Id',
                                                                 'BorrowerAccountPhone'        => 'Phone',
                                                                 'BorrowerAccountStreet'       => 'BillingStreet',
                                                                 'BorrowerAccountCity'         => 'BillingCity',
                                                                 'BorrowerAccountState'        => 'BillingState',
                                                                 'BorrowerAccountPostalCode'   => 'BillingPostalCode',
                                                                 'BorrowerAccountCountry'      => 'BillingCountry',
                                                                 'BorrowerAccountABN'          => 'ABN__c',
                                                                 'BorrowerAccountACN'          => 'ACN__c',
                                                                 'BorrowerAccount'             => 'Name',
                                                                 'BorrowerContactLookup'       => 'Id',
                                                                 'BorrowerContactStreet'       => 'MailingStreet',
                                                                 'BorrowerContactCity'         => 'MailingCity',
                                                                 'BorrowerContactState'        => 'MailingState',
                                                                 'BorrowerContactPostalCode'   => 'MailingPostalCode',
                                                                 'BorrowerContactCountry'      => 'MailingCountry',
                                                                 'BorrowerBirthDate'           => 'BirthDate',
                                                                 'BorrowerContactMobile'       => 'MobilePhone'
                                                                };

        receivedJSON = receivedJSON.replace('BorrowerAccountInformation', '-placeholder-');

        for(String key : mappingMap.KeySet()){
            if(receivedJSON != null){
                receivedJSON = receivedJSON.replace(key, mappingMap.get(key));
            }
        }
        receivedJSON = receivedJSON.replace('-placeholder-', 'BorrowerAccountInformation');

        //Update Borrower Contact details
        receivedJSON = receivedJSON.replace('BorrowerContactInformation', '-placeholder-');
        receivedJSON = receivedJSON.replace('BorrowerContact', '');
        receivedJSON = receivedJSON.replace('-placeholder-', 'BorrowerContactInformation');

        receivedJSON = receivedJSON.replace('RecordType', 'RecordTypeId');
        System.debug(receivedJSON);
        return receivedJSON;
    }

    /**
      * @author Lino Diaz Alonso
      * @date 23/03/2020
      * @description Method that receives the JSON generated on the new contact page
      *              and creates a new contact that will be used on the loan contacts page
      * @param receivedJSON JSON that contains all the data that needs to be inserted.
    */
    public static String createContact(String receivedJSON){
        System.debug(receivedJSON);
        receivedJSON = updateReceivedJSON(receivedJSON);
        receivedJSON =  receivedJSON.replace('BorrowerBirthDate', 'BirthDate');
        System.debug(receivedJSON);

        Contact newContact=(Contact) JSON.deserialize(receivedJSON,Contact.class);
        System.debug(newContact);
        try{
            insert newContact;
            Contact createdContact = [SELECT Id, Name FROM Contact WHERE Id =: newContact.Id];
            return JSON.serialize(createdContact);
        } 
        catch (Exception e){
            System.debug('---Exception Message:  '+e.getMessage()+' getLineNumber: '+e.getLineNumber());
            return 'Exception Message: ' + e.getMessage();
        } 

    }

    public static void createContentDocumentLink(Case insertedCase){
        List<ContentVersion> cDocLinkList = [SELECT ContentDocumentID 
                                             FROM ContentVersion 
                                             WHERE Description LIKE: '%' + insertedCase.Subject + '%'
                                             AND CreatedDate = TODAY];
        
        List<ContentDocumentLink> cdLinkToInsertList = new List<ContentDocumentLink>();

        for(ContentVersion cversion : cDocLinkList){
            ContentDocumentLink newclnk = new ContentDocumentLink();
            newclnk.LinkedEntityId    = insertedCase.Id;
            newclnk.ContentDocumentID = cversion.ContentDocumentID;
            newclnk.ShareType         = 'V';
            
            cdLinkToInsertList.add(newclnk);
        }

        if(cdLinkToInsertList.size()!=0){
            insert cdLinkToInsertList;
        }
    }
}