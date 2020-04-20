@isTest
public class LookupControllerTest {

    @testSetup
    static void buildConfigList() {
        Account account = new Account(name = 'TestAccount Lender');
        account.RecordtypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Finance').getRecordTypeId();
        insert account;

        Contact loanContact = new Contact(LastName = 'TestloanContact');
        insert loanContact;
    }

    /**
    * @method LookupController
    * @case   when the Lookup component is used
    * @result then we will be calling the lookupData method defined on the LookupController class.
    */
    @isTest static void test01_LookupController_whenLookupComponentIsUsed_CallLookupControllerMethod() {
        Id accRT = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Finance').getRecordTypeId();

        List<object> records = LookupController.lookupData('Account','TestAccount','RecordTypeId-'+accRT);
        
        System.assertEquals(1, records.size());
    }

    /**
    * @method LookupController
    * @case   when the Lookup component is used and the received parameters are not correct
    * @result then the method will be handling the exception
    */
    @isTest static void test02_LookupController_whenLookupComponentIsUsedWrongly_ManageException() {
        List<object> records = LookupController.lookupData('Account','TestAccount','test-test');
    }  
}