import * as users from "../../fixtures/users";

describe("Login workflow", () => {
  before(() => {
    cy.adminLogin();
  });
  it("should reset and then save first name", () => {
    cy.contains("Change Password").click();
    cy.get("input[aria-label='Password']")
      .clear()
      .type("Cypress");
    cy.get("input[aria-label='Confirm Password']")
      .clear()
      .type("Cypress");
    cy.contains("Reset").click();
    cy.get("input[aria-label='Password']").should("be.empty"); // clicking reset button will make the field blank
    // did not automate save scenario as I wasn't sure if it will actually overwrite the password or not
  });
});
