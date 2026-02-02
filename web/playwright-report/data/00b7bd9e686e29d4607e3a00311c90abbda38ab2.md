# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e14]:
    - generic [ref=e15]:
      - link [ref=e16] [cursor=pointer]:
        - /url: /
        - img [ref=e17]
      - generic [ref=e20]:
        - heading "Welcome back!" [level=3] [ref=e21]
        - paragraph [ref=e22]: We're glad to see you again
    - generic [ref=e24]:
      - generic [ref=e25]:
        - text: Email
        - textbox "Email" [active] [ref=e26]:
          - /placeholder: Your email
      - generic [ref=e27]:
        - text: Password
        - generic [ref=e28]:
          - textbox "Password" [ref=e29]
          - button "Show password" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
      - generic [ref=e34]:
        - checkbox "Remember me" [ref=e35] [cursor=pointer]
        - checkbox
        - generic [ref=e36] [cursor=pointer]: Remember me
      - button "Let's go!" [ref=e38] [cursor=pointer]
    - generic [ref=e39]:
      - link "Forgot password?" [ref=e40] [cursor=pointer]:
        - /url: /forgot-password
      - link "New here? Create account" [ref=e41] [cursor=pointer]:
        - /url: /register
```