import "./auth";

declare global {
  namespace Cypress {
    interface Chainable {
      adminLogin: () => Chainable<string>;
      getToken: () => Chainable<string>;
    }
  }
}
