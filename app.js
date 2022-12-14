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
            Blog.findOneAndRemove({title:"No Blog Uploaded"},function(err){
                if(!err){
                    console.log("Removed default data")
                }
            })
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
    var title = req.body.title;
    var description = req.body.content;
    var author = req.body.author;  
    const data = new Blog({
        title: title,
        description: description,
        date:today,
        author: author
    });

    Blog.findOne({title:title},function(err,result){
        if(result){
            console.log("Already exists")
        }
        else{
            data.save();
            res.redirect("/");
        }
    });

})

app.get("/dashboard",function(req,res){
    Blog.find({},function(err,result){
      if(!err){
        res.render("dashboard.ejs",{data:result})
      }  
    })
     
})

app.get("/posts/:title",function(req,res){
    var param = _.lowerCase(req.params.title);

    Blog.find({},function(err,result){
        result.forEach(element => {
            if (_.lowerCase(element.title) === param ){
                res.render("posts.ejs",{title:element.title,description:element.description,date:today,author:element.author})
            }
            else{
                console.log("Not found")
            }
        });
        
    })
  
})

app.post("/delete",function(req,res){
    const title = req.body.delete;
    Blog.deleteOne({title:title},function(err){
        if(!err){
            res.redirect("/dashboard");
        }
    })
})


app.listen(3000,function(){
    console.log("Server started at port 3000");
})