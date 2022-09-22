const express = require('express');
const bodyParser = require('body-parser');
const {restart} = require('nodemon');
const ejs = require('ejs');
const _ = require('lodash');

const app = express();
const about = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ut sem viverra aliquet eget sit. Amet dictum sit amet justo donec enim."
const contact = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum varius sit amet. Bibendum at varius vel pharetra vel."
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

const posts =[];


app.get("/",function(req,res){
    res.render('index.ejs',{texts:posts});
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


app.post("/",function(req,res){
    var data = {
        "title":req.body.title,
        "content":req.body.content
    };
    posts.push(data);
    res.redirect("/");
})

app.get("/posts/:title",function(req,res){
    var param = _.lowerCase(req.params.title);
    posts.forEach(function(data){
        if (_.lowerCase(data.title) === param){
            res.render("posts.ejs",{heading:data.title , content:data.content})
        }
    })
  
    // for(var i = 0 ; i< posts.length;i++){
    //     if (posts[i].title === param){
    //         console.log("Match found")
    //     }
    // }
})


app.listen(3000,function(){
    console.log("Server started at port 3000");
})