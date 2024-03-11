# LDAP User Management Project 🚀

This project is a web application developed with Next.js that provides an interface for user management on an LDAP server. It allows registering new users, authenticating existing users, and changing passwords.

## Setting Environment Variables 📝

Before running the application, you need to set the following environment variables:

`SECRET_KEY`: This is a secret key used for encrypting sensitive data or creating digital signatures in the application. It should be a long, random string and kept confidential.

`NEXT_PUBLIC_GITLAB_URL`: The URL of your GitLab instance. This is required if the application interacts with GitLab.

`NEXT_PUBLIC_JENKINS_URL`: The URL of your Jenkins instance. This is required if the application interacts with Jenkins.

`NEXT_PUBLIC_SONARQUBE_URL`: The URL of your SonarQube instance. This is required if the application interacts with SonarQube.

`LDAP_PASSWORD`: The password required for authentication with the LDAP server. Make sure this is a strong, secure password.

## Installation 🛠️

1. Clone this repository to your local machine:

```bash
git clone https://github.com/Miguel07Alm/next-ldap-client
```
2. Give permissions to /etc/ldap

```bash
sudo chmod 777 /etc/ldap
```
3. Install dependencies
```bash
bun i
```
