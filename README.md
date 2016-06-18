# node-directus

A Node.JS wrapper for the [Directus headless CMS API](http://getdirectus.com/api/overview/api-overview). Its only goal for the stable release is to provide *reading helpers* for the API, or simply put, to do only the **R** of C**R**UD.

**Not ready for production**.

## [Express.js](http://expressjs.com/) example in [ES2015](https://babeljs.io/docs/plugins/preset-es2015) + [Stage 3](https://babeljs.io/docs/plugins/preset-stage-3)

```javascript
import Directus from './src/directus.js'
const db = new Directus('http://192.168.33.6', 'fkCMPxSyvo7SNX8H');

app.get('/posts/:id', async (req, res) => {
  
  // Fetch post and render it
  let post = await db.table('posts').row(req.params.id);
  res.render('post.jade', { post });
  
}
```

## API

(coming soon)