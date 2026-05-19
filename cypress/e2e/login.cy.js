describe("Login tests", () => {
    it("should login successfully", () => {
        cy.visit("/");
        cy.getBySel("nav-link-login").click();
        cy.getBySel("login-input-username").type("test2@test.fr");
        cy.getBySel("login-input-password").type("testtest");
        cy.getBySel("login-submit").click();
        cy.getBySel("nav-link-cart").should("be.visible");
        cy.getBySel("nav-link-login").should("not.exist");
        cy.getBySel("nav-link-logout").should("be.visible");
    })
})