```sh
export N8N_SECURE_COOKIE=false
npm install
npm build
npm link
cd ~/.n8n/custom
npm link n8n-nodes-arvancloud
export N8N_SECURE_COOKIE=false
n8n start
```


```sh
cd ~/.n8n
mkdir custom
```

# remove pnpm
```ts
"scripts": {
  // Remove this line:
  "preinstall": "npx only-allow pnpm",
}
```


```sh
apikey fd0ce667-83be-5626-b70a-96bfc902b5af
```
