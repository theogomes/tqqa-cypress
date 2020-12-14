import * as users from "../../fixtures/users";

describe("Login and logout workflow", () => {
  it("should login with valid admin user and verify buttons on dashboard page", () => {
    cy.visit("login");
    cy.get("input[name=login]")
      .clear()
      .type(users.USER.ADMIN.username);
    cy.get("[id=password]")
      .clear()
      .type(users.USER.ADMIN.password);
    cy.get("button[type=button]").click();
    cy.url().should("contain", "dashboard");
    cy.get(".headline").should(
      "contain",
      `Welcome ${users.USER.ADMIN.username}`
    );
    cy.get(".v-card__actions")
      .should("contain", "View Profile")
      .and("contain", "Edit Profile")
      .and("contain", "Change Password");
  });

  it("should receive login error with invalid user credential", () => {
    cy.visit("login");
    cy.get("input[name=login]")
      .clear()
      .type(users.USER.ADMIN.username);
    cy.get("[id=password]")
      .clear()
      .type("pass1");
    cy.get("button[type=button]").click();
    cy.get(".v-alert")
      .should("be.visible")
      .and("contain", " Incorrect email or password ");
  });

  it("logout", () => {
    cy.adminLogin();
    cy.contains("Logout").click({ force: true });
    cy.url().should("contain", "login");
    cy.get("input[name=login]").should("be.visible");
  });
});
