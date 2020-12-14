import * as users from "../../fixtures/users";

describe("Login workflow", () => {
  before(() => {
    cy.adminLogin();
  });
  it("should reset and then save first name", () => {
    cy.contains("Edit Profile").click();
    cy.get("input[aria-label='Full Name']")
      .clear()
      .type("Cypress");
    cy.contains("Reset").click();
    cy.get("input[aria-label='Full Name']").should("be.empty"); // clicking reset button will make the field blank
    cy.get("input[aria-label='Full Name']")
      .clear()
      .type("Cypress");
    cy.contains("Save").click();
    cy.get(".my-4").should("contain", "----"); // value doesn't get saved
    cy.get(".my-3").should("contain", users.USER.ADMIN.username); // email should remain same
  });
});
