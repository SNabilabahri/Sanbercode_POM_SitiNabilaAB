import LoginPage from '../../support/POM/loginPage'
import loginData from '../../fixtures/loginData.json'

describe("OrangeHRM Login - automation with POM", () => {
    
    it("LOG_001 - Successfully login with valid username and valid password", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Admin')
        LoginPage.fillPassword('admin123')
        LoginPage.interceptDashboard()
        LoginPage.clickLogin()

        cy.wait('@dashboardReq').its('response.statusCode').should('eq', 200)
        LoginPage.assertDashboardVisible()
    })

    it("LOG_002 - Login failed with lowercase username", () => {
        LoginPage.visit()
        LoginPage.fillUsername('admin')
        LoginPage.fillPassword('admin123')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_003 - Login failed with valid username and wrong password", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Admin')
        LoginPage.fillPassword('admin321')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_004 - Login failed with invalid username and valid password", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Atmin')
        LoginPage.fillPassword('admin123')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_005 - Login failed when swapped username and password", () => {
        LoginPage.visit()
        LoginPage.fillUsername('admin123')
        LoginPage.fillPassword('Admin')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_006 - Login failed when username includes @gmail.com", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Admin@gmail.com')
        LoginPage.fillPassword('admin123')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        cy.url().should('include', '/auth/login')
    })

    it("LOG_007 - Login failed when password has '@' instead of 'a'", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Admin')
        LoginPage.fillPassword('@dmin123')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_008 - Login failed when both username and password are empty", () => {
        LoginPage.visit()
        LoginPage.fillUsername(' ')
        LoginPage.fillPassword(' ')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        cy.url().should('include', '/auth/login')
    })

    it("LOG_009 - Login failed when valid username is entered but password field is empty", () => {
        LoginPage.visit()
        LoginPage.fillUsername('Admin')
        LoginPage.fillPassword('')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })

    it("LOG_010 - Login failed when username field is empty but password is valid", () => {
        LoginPage.visit()
        LoginPage.fillUsername('')
        LoginPage.fillPassword('admin123')
        LoginPage.interceptLogin()
        LoginPage.clickLogin()

        cy.wait('@loginReq').its('response.statusCode').should('eq', 302)
        LoginPage.getErrorMessage().should('contain.text', 'Invalid credentials')
    })
})

