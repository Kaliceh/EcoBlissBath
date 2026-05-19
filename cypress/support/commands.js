// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add("getBySel", (selector) => {
    return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add("loginFront", () => {
    cy.visit("/login");

    cy.getBySel("login-input-username", { timeout: 10000 })
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type("test2@test.fr");

    cy.getBySel("login-input-password", { timeout: 10000 })
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type("testtest");

    cy.getBySel("login-submit")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

    cy.getBySel("nav-link-cart", { timeout: 10000 })
        .should("be.visible");
});

Cypress.Commands.add("deleteCart", () => {
    cy.window().then((win) => {
        const token = win.localStorage.getItem("token");

        if (!token) return;

        cy.request({
            method: "DELETE",
            url: "http://localhost:8081/orders",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false
        });
    });
});

Cypress.Commands.add("logout", () => {
    cy.getBySel("nav-link-logout")
        .should("be.visible")
        .click();
});