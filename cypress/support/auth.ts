import * as users from "../fixtures/users";

Cypress.Commands.add("adminLogin", () => {
  cy.visit("login");
  cy.get("input[name=login]")
    .clear()
    .type(users.USER.ADMIN.username);
  cy.get("[id=password]")
    .clear()
    .type(users.USER.ADMIN.password);
  cy.get("button[type=button]").click();
});

Cypress.Commands.add("getToken", () => {
  cy.request({
    method: "POST",
    form: true,
    url: `${Cypress.env("apiUrl")}login/access-token`,
    body: {
      username: users.USER.ADMIN.username,
      password: users.USER.ADMIN.password,
    },
    headers: { accept: "application/json" },
    retryOnStatusCodeFailure: true,
  }).then((response) => {
    return <string>response.body.access_token;
  });
});
