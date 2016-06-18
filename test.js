import assert from 'assert';
import Promise from 'bluebird';
import prettyjson from 'prettyjson';
import Directus from './src/directus.js'

const db = new Directus('http://192.168.33.6', 'fkCMPxSyvo7SNX8H');

(async () => {

  let posts = await db.table('Blog').rows({
    perPage: 1
  });
  
  console.log(posts);

})();

// API MOCKUP
// Does not work right now, but demonstrate the basic goal of this module
function apiMockup () {

  // Express route
  app.get('/services/:serviceName', (req, res) => {
  
    let entry = db.table('services').row(req.params.serviceName);
    res.render('static.jade', { entry });
  
  });

}

// $ curl http://192.168.33.6/api/1/tables/blog \
//   -u fkCMPxSyvo7SNX8H: