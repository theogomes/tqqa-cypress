import * as users from "../../fixtures/users";

describe("View profile workflow", () => {
  beforeEach(() => {
    cy.adminLogin();
  });
  it("should navigate to profile using left panel", () => {
    cy.contains("Profile").click({ force: true });
    cy.get(".v-card__text").should("contain", users.USER.ADMIN.username);
    cy.contains("Edit").click({ force: true });
    cy.url().should("contain", "profile/edit"); // verify clicking on Edit button takes user to edit profile page
  });
});
