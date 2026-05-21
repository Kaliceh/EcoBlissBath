describe("Faille XSS tests", () => {

    it("should not execute script in product opinion", () => {
        const title = "Bon produit";
        const comment = "<script>alert('XSS');</script>";
        const rating = 4;

        cy.loginFront();

        cy.getBySel("nav-link-reviews")
            .should("be.visible")
            .click();

        cy.getBySel("review-input-rating-images")
            .find("img")
            .eq(rating - 1)
            .click();

        cy.getBySel("review-input-title")
            .type(title);

        cy.getBySel("review-input-comment")
            .type(comment);

        cy.intercept("POST", "**/reviews").as("postreview");

        cy.getBySel("review-submit")
            .click();

        cy.wait("@postreview")
            .then((interception) => {
                expect(interception.response.statusCode).to.eq(200);

                expect(interception.response.body.comment).to.not.contain("<script>");
            });
    });
});
