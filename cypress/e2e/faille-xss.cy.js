describe("Faille XSS tests", () => {

    it("should not execute script in product opinion", () => {
        const title = "Bon produit";
        const comment = "<script>alert('XSS');</script>";
        const rating = 4;

        cy.intercept("POST", "**/login").as("postlogin");

        cy.loginFront();

        cy.wait("@postlogin")
            .then(() => {
                cy.getBySel("nav-link-reviews")
                    .click();
                cy.getBySel("review-input-rating-images")
                    .find("img")
                    .eq(rating - 1)
                    .click();
                cy.getBySel("review-input-title").type(title);
                cy.getBySel("review-input-comment").type(comment);

                cy.intercept("POST", "**/reviews").as("postreview");
                cy.getBySel("review-submit")
                    .click();
                cy.wait("@postreview");
                cy.on("window:alert", () => {
                    throw new Error("une fenêtre d'alerte s'est affichée !");
                });
            });
    });
});