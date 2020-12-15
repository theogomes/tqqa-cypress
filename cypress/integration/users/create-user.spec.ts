describe("Create User workflow", () => {
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

  it("should verify create user form validations, save user and login with that user", () => {
    let randomNumber = Math.floor(Math.random() * 10000000);
    const fullName = `Aaron${randomNumber} User`;
    const password = "password";
    const email = `atest${randomNumber}@email.com`;

    cy.contains("Create User").click({ force: true });
    cy.get("input[aria-label='Full Name']")
      .clear()
      .type(fullName);

    cy.contains("Reset").click(); // verify Reset button makes the Full Name field blank
    cy.get("input[aria-label='Full Name']")
      .invoke("val")
      .should("be.empty");

    cy.get("input[aria-label='Full Name']")
      .clear()
      .type(fullName); // fill the name again

    // verify app message are changed for email field
    cy.get("input[aria-label='E-mail']").type("test");
    cy.get(".v-text-field__details")
      .eq(1)
      .should("contain", "The email field must be a valid email");

    cy.get("input[aria-label='E-mail']")
      .clear()
      .type(email); // type valid email

    // verify app messages are changed for Is Supervisor checkbox
    cy.get(".subheading")
      .first()
      .find("span")
      .should("contain", "(currently is not a superuser)");
    cy.get("input[aria-label='Is Superuser']").click({ force: true });
    cy.get(".subheading")
      .first()
      .find("span")
      .should("contain", "(currently is a superuser)");

    // verify app messages are changed for Is Active checkbox
    cy.get("input[aria-label='Is Active']").should("be.checked"); // by default it should be checked
    cy.get(".subheading")
      .last()
      .find("span")
      .should("contain", "(currently active)");
    cy.get("input[aria-label='Is Active']").click({ force: true });
    cy.get(".subheading")
      .last()
      .find("span")
      .should("contain", "(currently not active)");

    // verify app messages are changed for email field
    cy.get("input[aria-label='Set Password']")
      .clear()
      .type(password);
    cy.get("input[aria-label='Confirm Password']")
      .clear()
      .type("aa"); // type different password to display validation message
    cy.get(".v-text-field__details")
      .last()
      .should("contain", "The password confirmation does not match");

    cy.get("input[aria-label='Confirm Password']")
      .clear()
      .type(password); // type same password to ensure validation message is no longer visible
    cy.get(".v-text-field__details")
      .last()
      .should("contain", "");
    cy.contains("Save").click();

    // verify table contains the newly created user name and email
    cy.get(".v-select__slot").click();
    cy.get(".v-list")
      .find("div")
      .contains("All")
      .click(); // change rows per page to All

    cy.get(".v-table__overflow").then((table) => {
      cy.contains("Full Name")
        .click()
        .find("i")
        .should("contain", "arrow_upward");
      cy.get(table)
        .find("tbody>tr")
        .should("contain", email)
        .and("contain", fullName);
    });

    // logout and login with the newly created user
    cy.contains("Logout").click({ force: true });
    cy.get("input[name=login]")
      .clear()
      .type(email);
    cy.get("[id=password]")
      .clear()
      .type(password);
    cy.get("button[type=button]")
      .first()
      .click();
    cy.get(".headline").should("contain", `Welcome ${fullName}`);
  });
});
