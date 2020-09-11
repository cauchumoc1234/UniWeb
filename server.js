const express = require('express')
const app = express()
const port = 3000 //cổng chạy localhost
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
var db = require('./db');
var auth_middleware = require('./middlewares/auth.middleware')
var filter_middleware = require('./middlewares/filter_topic')
app.use(express.static('public'))

var User = require('./models/user.model')
var Post = require('./models/post.model')

//khởi tạo
app.listen(process.env.PORT || 3000 , () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  //view engine
app.set('view engine', 'pug')
app.use(cookieParser(process.env.APP_SECRET))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
     Post.find({},"_id title topic",(err,result)=>{
      res.render("home" , {
        //we only need 4 post for each topic
        thongbao:filter_middleware.filter(result,"thong bao").slice(0,4),
        tintuc: filter_middleware.filter(result,"tin tuc").slice(0,4),
        tuyensinh: filter_middleware.filter(result,"tuyen sinh").slice(0,4),
        nghiencuukhoahoc: filter_middleware.filter(result,"nghien cuu khoa hoc").slice(0,4),
        hoptac: filter_middleware.filter(result,"hop tac lien ket").slice(0,4),
        danhmuc: filter_middleware.filter(result,"danh muc").slice(0,4) 
    });
    })

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
  Post.find({$or: [{title:{$regex:req.query.q,$options:"$i"}},{topic:{$regex:req.query.q,$options:"$i"}}]},"_id title body",function(err,posts){
     res.render('search',{posts:posts})
  })
})
app.get('/post/:id',function(req,res){
  
  Post.find({_id : req.params.id },"title body",function(err,posts){
    res.render('post',{post:posts[0]})
  })
  // res.redirect('/post')
})
app.get('/post',function(req,res){
  Post.find({_id : req.query.id },"title body",function(err,posts){
    res.render('post',{post:posts[0]})
  })
})