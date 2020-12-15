import * as users from "../../fixtures/users";

describe("Edit User workflow", () => {
  const EMAIL = "admin@tqqaproject.com";
  const clickOnEditOfUser = (email: string) => {
    cy.get(".v-table__overflow")
      .contains("td", email) // verify table contains the new saved user
      .then((elem) => {
        cy.get(elem)
          .siblings()
          .find("span>a")
          .click(); // click the edit link for that particular user
      });
  };

  before(() => {
    cy.adminLogin();
    cy.contains("Manage Users").click();
  });

  it("should verify app messages for super user and is active and email field", () => {
    clickOnEditOfUser(EMAIL);
    // verify app messages are changed for Is Supervisor checkbox
    cy.get("input[aria-label='Is Superuser']").should("be.checked");
    cy.get(".subheading")
      .eq(1)
      .find("span")
      .should("contain", "(currently is a superuser)");
    cy.get("input[aria-label='Is Superuser']").click({ force: true });
    cy.get(".subheading")
      .eq(1)
      .find("span")
      .should("contain", "(currently is not a superuser)");

    // verify app messages are changed for Is Active checkbox
    cy.get("input[aria-label='Is Active']").should("be.checked");
    cy.get(".subheading")
      .eq(2)
      .find("span")
      .should("contain", "(currently active)");
    cy.get("input[aria-label='Is Active']").click({ force: true });
    cy.get(".subheading")
      .eq(2)
      .find("span")
      .should("contain", "(currently not active)");

    // verify app messages are changed for email field
    cy.get("input[aria-label='E-mail']").clear();
    cy.get(".v-messages__message").should(
      "contain",
      "The email field is required"
    );
    cy.get("input[aria-label='E-mail']").type("test");
    cy.get(".v-text-field__details")
      .eq(1)
      .should("contain", "The email field must be a valid email");

    // checking password checkbox will display confirm password checkbox
    cy.get("input[aria-label='Confirm Password']").should("not.be.visible"); // confirm password is not visible unless password checkbox is checked
    cy.get(".v-input--selection-controls__input")
      .eq(2)
      .find("input")
      .click({ force: true }); // check the checkbox
    cy.get("input[aria-label='Set Password']")
      .clear()
      .type("a");
    cy.get("input[aria-label='Confirm Password']")
      .should("be.visible") // confirm password should be visible now
      .clear()
      .type("aa"); // type different password to display validation message
    cy.get(".v-text-field__details")
      .last()
      .should("contain", "The password confirmation does not match");

    cy.get("input[aria-label='Confirm Password']")
      .clear()
      .type("a"); // type same password to ensure validation message is no longer visible
    cy.get(".v-text-field__details")
      .last()
      .should("contain", "");
  });
});
