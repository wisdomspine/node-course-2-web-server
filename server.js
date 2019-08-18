const express=require('express');
const path= require('path');
const fs= require('fs');
const PORT=3000;
const ejs= require('ejs');

const MAINTENANCE_MODE=true;

const app= express();

const LOG_FILE=path.join(__dirname, 'logs/', 'server.txt');

app.use((req, res, next)=>{
  // url from ip @ time
  const log= req.originalUrl+" from "+req.ip+ " @ "+ new Date();
  fs.appendFile(LOG_FILE, log+'\n', e=>{
      //log error
  })
  console.log(log)
  next();
})

app.set('view engine', 'ejs');

//serve maintenance page

app.use((req, res, next)=>{
  if(MAINTENANCE_MODE){
    res.render(path.join('maintenance'));
  }else{
    next();
  }
})

app.get("/:page", (req, res)=>{
    const page=req.params.page;
    const file=path.join(__dirname, "/views", page+".ejs");
    fs.access(file, fs.constants.F_OK, e=>{
        if(e){
            res.send("Sorry!, you messed up")
        }else{
            res.render("page", {title:page, active:page, page:page})
        }
    })
})

app.get("/", (req, res)=>{
    res.render("page.ejs", {title:"home", active:"home", page:"index"});

})

app.use(express.static(path.join(__dirname, "/static")));
//app.use('/vps', express.static(path.join(__dirname, '/static/')));

app.listen(PORT);
