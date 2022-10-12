const express = require('express');
const bodyParser = require('body-parser');
const {restart} = require('nodemon');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');



mongoose.connect("mongodb+srv://admin-sudan:onevoice123@cluster0.s4syznv.mongodb.net/blogsiteDB")

const blogSchema = {
    title:String,
    description: String,
    date:String,
    author:String
}

const Blog =mongoose.model("Blog", blogSchema);

const noblog = {
    title : 'No Blog Uploaded',
    description: 'No contents',
    date:'null',
    author:'null'
}

var options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}
var date = new Date();
var today = date.toLocaleDateString("en-US", options);


app.get("/",function(req,res){
    
    Blog.find({},function(err,items){
        if (items.length ===0){
            Blog.insertMany([noblog],function(err){
                if (!err){
                    console.log("no error");
                }
            })
            res.redirect("/");
        }else{
        res.render('index.ejs',{texts:items});
        }
    })
})

app.get("/about",function(req,res){
    res.render('about.ejs',{texts:about})
})

app.get("/contact",function(req,res){
    res.render('contact.ejs',{texts:contact})
})

app.get("/compose",function(req,res){
    res.render('compose.ejs')
})


app.post("/compose",function(req,res){
    const data = new Blog({
        title: req.body.title,
        description:req.body.content,
        date:today,
        author:req.body.author
    });
    Blog.findOne({title:title},function(err,result){
        if(!err){
            result.push(data);
            result.save();
            res.redirect("/");
        }
    })

})

app.get("/posts/:title",function(req,res){
    var param = _.lowerCase(req.params.title);
    posts.forEach(function(data){
        if (_.lowerCase(data.title) === param){
            res.render("posts.ejs",{heading:data.title , content:data.content})
        }
    })
  
})


app.listen(3000,function(){
    console.log("Server started at port 3000");
})