const express = require('express')
const app = express()
const port = 3000 //cổng chạy localhost
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
var db = require('./db');
var auth_middleware = require('./middlewares/auth.middleware')
app.use(express["static"]("public"));

var User = require('./models/user.model')
var Post = require('./models/post.model')
//khởi tạo
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  //view engine
app.set('view engine', 'pug')
app.use(cookieParser(process.env.APP_SECRET))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
    res.render("home");
  })
app.get('/login',(req,res)=>{
  res.render('login')
})
app.post('/login',(req,res)=>{
  User.find({'username':req.body.username,'password':req.body.password} , 'username password role',function(err,users){
    if (err) return handleError(err);
      if(users[0]){
        res.cookie('id', users[0]._id, {maxAge : 7200000,signed: true })
        res.redirect('/add-post')
      }
      else{
        res.redirect('/login')
      }
  })
})
app.get("/add-post",auth_middleware.requireAuth,(req,res)=>{
    res.render('add_post')
})
app.post('/add-post',(req,res)=>{
  Post.create({
    title:req.body.title,
    body:req.body.body,
    topic:req.body.topic
  })
  res.redirect('add-post')
})
app.get('/search',function(req,res){
  Post.find({$or: [{title:{$regex:req.query.q,$options:"$i"}},{topic:{$regex:req.query.q,$options:"$i"}}]},"title body",function(err,posts){
     res.render('search',{posts:posts})
    
  })
})
app.get('/post',function(req,res){
  Post.find({_id : req.query.id },"title body",function(err,posts){
    res.render('post',{post:posts[0]})
  })
})