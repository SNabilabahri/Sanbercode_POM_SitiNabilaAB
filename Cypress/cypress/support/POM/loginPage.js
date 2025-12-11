// cypress/support/POM/loginPage.js

class LoginPage {
    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    }

    fillUsername(username) {
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').clear().type(username)
    }

    fillPassword(password) {
        cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input').clear().type(password)
    }

    clickLogin() {
        cy.get('.oxd-button').click()
    }

    interceptLogin(aliasName = 'loginReq') {
        cy.intercept('POST', '/web/index.php/auth/validate').as(aliasName)
    }

    interceptDashboard(aliasName = 'dashboardReq') {
        cy.intercept('GET', '/web/index.php/api/v2/dashboard/employees/action-summary').as(aliasName)
    }

    getErrorMessage() {
        return cy.get('.oxd-alert-content-text')
    }

    assertDashboardVisible() {
        cy.url().should('include', '/dashboard')
        cy.contains('Dashboard').should('be.visible')
    }
}

export default new LoginPage()