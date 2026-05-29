# Security

Security requirements:

- Use JWT authentication for protected APIs.
- Use RBAC for authorization.
- Do not commit secrets, credentials, `.env` files, Terraform state, or `*.tfvars`.
- Store CI/CD secrets in GitHub Actions secrets.
- Store Terraform remote state in AWS S3.

