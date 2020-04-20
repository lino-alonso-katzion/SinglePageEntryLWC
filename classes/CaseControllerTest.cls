@isTest
public class CaseControllerTest {

    @testSetup
    static void buildConfigList() {
        Account account = new Account(name = 'TestAccount Lender');
        account.RecordtypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Finance').getRecordTypeId();
        insert account;

        Contact loanContact = new Contact(LastName = 'TestloanContact');
        insert loanContact;
    }

    /**
    * @method CaseController
    * @case   when a Create New Case is used
    * @result then we will be calling the methods defined on the CaseController class.
    */
    @isTest static void test01_CaseController_whenCreateNewCaseIsUsed_CallCaseControllerMethods() {
        CaseController.collectGeneralDependency();
        CaseController.getSObjectDetails(getLender('TestAccount Lender').Id);
        CaseController.getContactDetails(getLoanContact().Id);
    }

    /**
    * @method CaseController
    * @case   when a Create New Case is used and the save button is clicked
    * @result then we will be calling the saveCaseDetails method on the Case Controller class
    */
    @isTest static void test02_CaseController_whenCreateNewCaseIsUsed_CallSaveDetailsWhenClickOnSave() {
        String sampleJSONPayload = '{"BorrowerAccountInformation":{"BorrowerAccountLookup":null,"BorrowerAccount":"Test Account","BorrowerAccountPhone":"4490219615","BorrowerAccountStreet":"Katzion, Level 6, 309 George St","BorrowerAccountCity":"SYDNEY","BorrowerAccountState":"NSW","BorrowerAccountPostalCode":"2000","BorrowerAccountCountry":"Australia"},"BorrowerContactInformation":{"BorrowerContactLookup":null,"BorrowerContactFirstName":"Test Contact 2","BorrowerContactLastName":"Alonso","BorrowerContactEmail":null,"BorrowerContactPhone":"4490219615","BorrowerContactMobile":"490219615","BorrowerBirthDate":null,"BorrowerContactCity":"SYDNEY","BorrowerContactState":"NSW","BorrowerContactPostalCode":"2000","BorrowerContactCountry":null},"RTName":"Collection Request","Type":"Repossession","Priority":"Medium","Subject":"Test Subject","Description":"Test Description","LoanData":[]}';

        Test.startTest();
        CaseController.saveCaseDetails(sampleJSONPayload);
        Test.stopTest();
    }

    /**
    * @method CaseController
    * @case   when a Create New Case is used and the save button is clicked on the New
    *         Loan Contact page
    * @result then we will be calling the saveContactDetails method on the Case Controller class
    */
    @isTest static void test02_CaseController_whenCreateNewCaseIsUsed_CallsaveContactDetailsWhenClickOnSave() {
        String sampleJSONPayload = '{ "BorrowerContactLookup": null, "BorrowerContactFirstName": "Test Contact", "BorrowerContactLastName": "LastName", "BorrowerContactEmail": null, "BorrowerContactPhone": "0490219615", "BorrowerContactMobile": null, "BorrowerBirthDate": null, "BorrowerContactCity": null, "BorrowerContactState": null, "BorrowerContactPostalCode": null, "BorrowerContactCountry": null }';

        Test.startTest();
        CaseController.saveContactDetails(sampleJSONPayload);
        Test.stopTest();
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