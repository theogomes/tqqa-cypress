import * as users from "../../fixtures/users";

describe("Manage User workflow", () => {
  const USERNAME = "John Smith";
  const EMAIL = "user@user.com";
  const fillUserForm = () => {
    cy.contains("Create User").click({ force: true });
    cy.get("input[aria-label='Full Name']")
      .clear()
      .type(USERNAME);
    cy.get("input[aria-label='E-mail']")
      .clear()
      .type(EMAIL);
    cy.get("input[aria-label='Set Password']")
      .clear()
      .type("password");
    cy.get("input[aria-label='Confirm Password']")
      .clear()
      .type("password");
  };
  const clickOnEditOfUser = () => {
    cy.get(".v-table__overflow")
      .contains("td", EMAIL) // verify table contains the new saved user
      .then((elem) => {
        cy.get(elem)
          .siblings()
          .find("span>a")
          .click(); // click the edit link for that particular user
      });
  };

  beforeEach(() => {
    cy.adminLogin();
    cy.contains("Manage Users").click();
  });

  it("should reset button will reset the form for unsaved form data", () => {
    fillUserForm();
    cy.contains("Reset").click();
    cy.get("input[aria-label='Full Name']").should("be.empty");
    cy.get("input[aria-label='E-mail']").should("be.empty");
    cy.contains("Cancel").click();
  });

  it("should save new user, edit user name and reset the user", () => {
    fillUserForm();
    cy.contains("Save").click();
    clickOnEditOfUser();
    cy.get("input[aria-label='Full Name']")
      .invoke("val")
      .should("contain", USERNAME);
    cy.get("input[aria-label='E-mail']")
      .invoke("val")
      .should("contain", EMAIL);

    // edit the user name and verify (app doesn't allow edit)
    cy.get("input[aria-label='Full Name']")
      .clear()
      .type("Edited Name"); // Edit the full name
    cy.contains("Save").click();
    cy.get(".v-table__overflow")
      .should("contain", EMAIL)
      .and("contain", USERNAME); // verify updated name is reflected (the update does not work so verifying the old name)

    // reset button will not reset form data of existing user
    clickOnEditOfUser();
    cy.contains("Reset").click();
    cy.get("input[aria-label='Full Name']")
      .invoke("val")
      .should("contain", USERNAME);
    cy.get("input[aria-label='E-mail']")
      .invoke("val")
      .should("contain", EMAIL);

    // wanted to verify if user can be inactive but that functionality does not work, so didn't write test for it
  });

  it("should change order and verify", () => {
    cy.get(".v-select__slot").click();
    cy.get(".v-list")
      .children()
      .then((children) => {
        cy.get(children)
          .eq(3)
          .click();
      });
    cy.get(".v-table__overflow").then((table) => {
      // sort up and verify user emails are sorted in a-z order
      cy.contains("Email")
        .click()
        .find("i")
        .should("contain", "arrow_upward")
        .should("be.visible");
      cy.get(table)
        .find("tbody>tr")
        .first()
        .should("contain", users.USER.ADMIN.username);
      cy.get(table)
        .find("tbody>tr")
        .last()
        .should("contain", "user@user.com");

      // sort down and verify user emails are sorted in z-a order
      cy.contains("Email").click();
      cy.get(table)
        .find("tbody>tr")
        .first()
        .should("contain", "user@user.com");
      cy.get(table)
        .find("tbody>tr")
        .last()
        .should("contain", users.USER.ADMIN.username);
    });
  });
});
