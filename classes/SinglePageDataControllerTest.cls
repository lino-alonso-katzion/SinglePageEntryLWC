@isTest
public class SinglePageDataControllerTest {
    @testSetup
    static void buildConfigList() {
        Account account = new Account(name = 'TestAccount Lender');
        account.RecordtypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Finance').getRecordTypeId();
        insert account;

        Contact loanContact = new Contact(LastName = 'TestloanContact');
        insert loanContact;
    }

    /**
    * @method SinglePageDataController
    * @case   when a new Case is created on the Create New Case page and case, account and contact
    *         details are passed
    * @result then we insert all the records in Salesforce as per the received JSON.
    */
    @isTest static void test01_SinglePageDataController_whenCaseDetailsReceived_CreateAccountAndContactRecords() {
        String sampleJSONPayload = '{"BorrowerAccountInformation":{"BorrowerAccountLookup":null,"BorrowerAccount":"Test Account","BorrowerAccountPhone":"4490219615","BorrowerAccountStreet":"Katzion, Level 6, 309 George St","BorrowerAccountCity":"SYDNEY","BorrowerAccountState":"NSW","BorrowerAccountPostalCode":"2000","BorrowerAccountCountry":"Australia"},"BorrowerContactInformation":{"BorrowerContactLookup":null,"BorrowerContactFirstName":"Test Contact 2","BorrowerContactLastName":"Alonso","BorrowerContactEmail":null,"BorrowerContactPhone":"4490219615","BorrowerContactMobile":"490219615","BorrowerBirthDate":null,"BorrowerContactCity":"SYDNEY","BorrowerContactState":"NSW","BorrowerContactPostalCode":"2000","BorrowerContactCountry":null},"RTName":"Collection Request","Type":"Repossession","Priority":"Medium","Subject":"Test Subject","Description":"Test Description","LoanData":[]}';

        Test.startTest();
        SinglePageDataController.processReceivedPayload(sampleJSONPayload);
        Test.stopTest();

        List<Case> insertedCase = [SELECT Id FROM Case WHERE Subject = 'Test Subject'];
        System.assertEquals(1, insertedCase.size(),'A new Case has been created on the Create New Case page');

        List<Account> insertedBorrowerAccount = [SELECT Id FROM Account WHERE Name = 'Test Account'];
        System.assertEquals(1, insertedBorrowerAccount.size(),'A new Account has been created on the Create New Case page');
    }

    /**
    * @method SinglePageDataController
    * @case   when a new Case is created on the Create New Case page and case, account, contact
    *         and loan details are passed
    * @result then we insert all the records in Salesforce as per the received JSON.
    */
    @isTest static void test02_SinglePageDataController_whenCaseDetailsReceived_CreateLoanRecords() {
        String sampleJSONPayload = '{"BorrowerAccountInformation":{"BorrowerAccountLookup":null,"BorrowerAccount":"Test Account","BorrowerAccountPhone":"098312323","BorrowerAccountStreet":"Katzion, Level 6, 309 George St","BorrowerAccountCity":"SYDNEY","BorrowerAccountState":"NSW","BorrowerAccountPostalCode":"2000","BorrowerAccountCountry":null},"BorrowerContactInformation":{"BorrowerContactLookup":null,"BorrowerContactFirstName":"Test Contact 2","BorrowerContactLastName":"LastName","BorrowerContactEmail":null,"BorrowerContactPhone":null,"BorrowerContactMobile":null,"BorrowerBirthDate":"1999-03-10","BorrowerContactCity":"SYDNEY","BorrowerContactState":null,"BorrowerContactPostalCode":"2000","BorrowerContactCountry":null},"RTName":"Collection Request","Type":"Repossession","Priority":"Medium","Subject":"Test Subject","Description":"Test Description","LoanData":[{"Name":"000001","SA_Type__c":"Consumer","SA_Account__c":"'+getLender('TestAccount Lender').Id+'","DefaultNoticeExpiryDate__c":"2020-03-18","SA_Account_Balance__c":"1232123","SA_Amount_Due_Outstanding_Amount__c":"245","SA_Contract_Date__c":null,"SA_Current_Arrears__c":"23132","SA_Current_Payout__c":"12321","SA_Installment_Frequency__c":"Monthly","SA_Installment_Amount__c":null,"SA_Interest_Type__c":"Fixed","SA_Installment_Start_Date__c":"2020-02-18","SA_Maturity_Date__c":"2020-02-26","SA_Loan_Amount__c":null,"SA_Rate_of_Interest__c":null,"SA_Payout_Due_Date__c":null,"LastInstalmentAmount__c":null,"LastInstalmentPaid__c":null,"LoanContactData":[],"AssetData":[]}]}';

        Test.startTest();
        SinglePageDataController.processReceivedPayload(sampleJSONPayload);
        Test.stopTest();

        List<SA_Loan__c> insertedLoan = [SELECT Id FROM SA_Loan__c WHERE Name = '000001'];
        System.assertEquals(1, insertedLoan.size(),'A new Loan has been created on the Create New Case page');
    }

    /**
    * @method SinglePageDataController
    * @case   when a new Case is created on the Create New Case page and case, account, contact
    *         loan, loan contacts and asset details are passed
    * @result then we insert all the records in Salesforce as per the received JSON.
    */
    @isTest static void test03_SinglePageDataController_whenCaseDetailsReceived_CreateLoanContactAndAssetRecords() {
        Id assetRT = Schema.SObjectType.Asset.getRecordTypeInfosByName().get('General').getRecordTypeId();
        String sampleJSONPayload = '{ "BorrowerAccountInformation": { "BorrowerAccountLookup": null, "BorrowerAccount": "Test Account", "BorrowerAccountPhone": "0490219615", "BorrowerAccountStreet": "L34 274 BOTANY ROAD", "BorrowerAccountCity": "ALEXANDRIA", "BorrowerAccountState": "NSW", "BorrowerAccountPostalCode": "2015", "BorrowerAccountCountry": "Australia" }, "BorrowerContactInformation": { "BorrowerContactLookup": null, "BorrowerContactFirstName": "Test Contact", "BorrowerContactLastName": "LastName", "BorrowerContactEmail": null, "BorrowerContactPhone": "0490219615", "BorrowerContactMobile": null, "BorrowerBirthDate": null, "BorrowerContactCity": null, "BorrowerContactState": null, "BorrowerContactPostalCode": null, "BorrowerContactCountry": null }, "RTName": "Collection Request", "Type": "Repossession", "Priority": "Medium", "Subject": "Test Subject", "LoanData": [ { "Name": "00001", "SA_Type__c": "Consumer", "SA_Account__c": "'+getLender('TestAccount Lender').Id+'", "DefaultNoticeExpiryDate__c": "2020-03-24", "SA_Account_Balance__c": "1232123", "SA_Amount_Due_Outstanding_Amount__c": "245", "SA_Contract_Date__c": null, "SA_Current_Arrears__c": null, "SA_Current_Payout__c": null, "SA_Installment_Frequency__c": "Monthly", "SA_Installment_Amount__c": null, "SA_Interest_Type__c": "Fixed", "SA_Installment_Start_Date__c": null, "SA_Maturity_Date__c": null, "SA_Loan_Amount__c": null, "SA_Rate_of_Interest__c": null, "SA_Payout_Due_Date__c": null, "LastInstalmentAmount__c": null, "LastInstalmentPaid__c": null, "LoanContactData": [ { "Contact_Input__c": "'+getLoanContact().Id+'", "Role__c": "Borrower" } ], "AssetData": [ { "Name": "00001", "VIN__c": "12321312", "Registration_Number__c": null, "Engine_Number__c": null, "Build_Date__c": null, "Colour__c": null, "RecordType": "'+assetRT+'", "Description": null } ] } ] }';

        Test.startTest();
        SinglePageDataController.processReceivedPayload(sampleJSONPayload);
        Test.stopTest();

        List<Loan_Contact__c> insertedLoanContact = [SELECT Id FROM Loan_Contact__c LIMIT 1];
        System.assertEquals(1, insertedLoanContact.size(),'A new Loan Contact has been created on the Create New Case page');
        
        List<Asset> insertedAsset = [SELECT Id FROM Asset LIMIT 1];
        System.assertEquals(1, insertedAsset.size(),'A new Asset has been created on the Create New Case page');
    }

    /**
    * @method SinglePageDataController
    * @case   when a new Contact is created on the Loan Contact section of the Create
    *         New Case page the contacts details will be sent in a JSON format
    * @result then we will insert the contact in Salesforce
    */
    @isTest static void test04_SinglePageDataController_whenContactDetailsReceived_CreateContactRecords() {
        String sampleJSONPayload = '{ "BorrowerContactLookup": null, "BorrowerContactFirstName": "Test Contact", "BorrowerContactLastName": "LastName", "BorrowerContactEmail": null, "BorrowerContactPhone": "0490219615", "BorrowerContactMobile": null, "BorrowerBirthDate": null, "BorrowerContactCity": null, "BorrowerContactState": null, "BorrowerContactPostalCode": null, "BorrowerContactCountry": null }';

        Test.startTest();
        SinglePageDataController.createContact(sampleJSONPayload);
        Test.stopTest();

        List<Contact> insertedContact = [SELECT Id FROM Contact WHERE FirstName = 'Test Contact'];
        System.assertEquals(1, insertedContact.size(),'A new Loan Contact has been created on the Create New Case page');
    }

    /**
    * Helper function to get a particular Lender
    */ 
    private static Contact getLoanContact() {
        return [ SELECT Id
                 FROM   Contact
                 LIMIT 1];
    }
    
    /**
    * Helper function to get a particular Lender
    */ 
    private static Account getLender( String accountName ) {
        return [ SELECT Id, Name
                 FROM   Account
                 WHERE  Name =: accountName ];
    }
}