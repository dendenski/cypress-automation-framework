/**
 * Mail.tm API helper for generating and managing temporary emails
 * API Documentation: https://api.mail.tm/
 */

class MailHelper {
  /**
   * Create a temporary email account
   * @param {string} address - Optional custom email address
   * @param {string} password - Optional password (generated if not provided)
   * @returns {Promise} Response with email details including id and address
   */
  static getAvailableDomain() {
    return cy
      .request({
        method: "GET",
        url: "https://api.mail.tm/domains",
      })
      .then((response) => {
        const domains = response.body["hydra:member"] || [];
        if (!domains.length) {
          throw new Error("No available mail.tm domains returned by API");
        }
        return domains[0].domain;
      });
  }

  static createTempEmail(address, password) {
    const emailPassword = password || this.generatePassword();

    const buildAddress = () => {
      if (address) {
        return cy.wrap(address);
      }
      return this.getAvailableDomain().then((domain) => {
        return `cypress_${Date.now()}@${domain}`;
      });
    };

    return buildAddress().then((emailAddress) => {
      return cy
        .request({
          method: "POST",
          url: "https://api.mail.tm/accounts",
          body: {
            address: emailAddress,
            password: emailPassword,
          },
        })
        .then((response) => {
          return {
            email: response.body.address,
            password: emailPassword,
            id: response.body.id,
          };
        });
    });
  }

  /**
   * Get JWT token for email account authentication
   * @param {string} email - Email address
   * @param {string} password - Email password
   * @returns {Promise} JWT token
   */
  static getToken(email, password) {
    return cy
      .request({
        method: "POST",
        url: "https://api.mail.tm/token",
        body: {
          address: email,
          password: password,
        },
      })
      .then((response) => {
        return response.body.token;
      });
  }

  /**
   * Get messages for an email account
   * @param {string} token - JWT token from authentication
   * @returns {Promise} List of messages
   */
  static getMessages(token) {
    return cy
      .request({
        method: "GET",
        url: "https://api.mail.tm/messages",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.body["hydra:member"] || [];
      });
  }

  /**
   * Get a specific message by ID
   * @param {string} messageId - Message ID
   * @param {string} token - JWT token
   * @returns {Promise} Message details
   */
  static getMessage(messageId, token) {
    return cy
      .request({
        method: "GET",
        url: `https://api.mail.tm/messages/${messageId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.body;
      });
  }

  static parseOtpFromMessage(message) {
    const content = [message.subject, message.text, message.html]
      .filter(Boolean)
      .join(" ");

    const match = content.match(/\b(\d{6})\b/);
    return match ? match[1] : null;
  }

  /**
   * Wait for the first 6-digit OTP in the user's inbox
   * @param {string} email - Email address
   * @param {string} password - Email password
   * @param {number} timeout - Max time to wait in ms
   * @returns {Promise<string>} The 6-digit OTP string
   */

  static waitForOtp(email, password, timeout = 30000) {
    return this.getToken(email, password).then((token) => {
      const startTime = Date.now();

      const checkOtp = () => {
        return this.getMessages(token).then((messages) => {
          if (!messages.length) {
            if (Date.now() - startTime > timeout) {
              throw new Error(`6-digit OTP not found within ${timeout}ms`);
            }

            return cy.wait(2000).then(() => checkOtp());
          }

          const latestMessage = messages[0];

          return this.getMessage(latestMessage.id, token).then(
            (fullMessage) => {
              console.log(fullMessage);
              const otp = this.parseOtpFromMessage(fullMessage);
              console.log("otp", otp);
              if (otp) {
                cy.log(`OTP found: ${otp}`);
                return cy.wrap(otp);
              }

              if (Date.now() - startTime > timeout) {
                throw new Error(`6-digit OTP not found within ${timeout}ms`);
              }

              return cy.wait(2000).then(() => checkOtp());
            },
          );
        });
      };

      return checkOtp();
    });
  }

  /**
   * Generate a random password
   * @returns {string} Generated password
   */
  static generatePassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  static deleteAccount(email, password) {
    return this.getToken(email, password).then((token) => {
      return cy
        .request({
          method: "GET",
          url: "https://api.mail.tm/me",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ body }) => {
          return cy.request({
            method: "DELETE",
            url: `https://api.mail.tm/accounts/${body.id}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        });
    });
  }
}

export default MailHelper;
