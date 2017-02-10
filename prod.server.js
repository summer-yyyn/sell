/**
 * Created by admin on 2017/2/10.
 */
// my http server
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);

//自定义开始  router异步借口
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function(req, res){
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function( req, res){
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function(req, res){
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);

//自定义结束

// 定义static目录
app.use(express.static('./dist'));

// 启动express
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
