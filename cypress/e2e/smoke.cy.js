describe('Smoke Tests', () => {
    it("the fields and login buttons must be present.", () => {
        cy.visit("/");
        cy.getBySel("nav-link-login").should("be.visible");
        cy.getBySel("nav-link-login").click();
        cy.getBySel("login-input-username").should("be.visible");
        cy.getBySel("login-input-password").should("be.visible");
        cy.getBySel("login-submit").should("be.visible");
    });
    it("the add to cart buttons must be present when you are logged in.", () => {
        cy.loginFront();
        cy.getBySel("product-home-link").first().click();
        cy.getBySel("detail-product-add").should("be.visible");
    });
});