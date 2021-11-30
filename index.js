const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express();

  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));


  app.get('/', (req, res) => res.render('pages/index'))

  app.use('/current_time', (req, res) => {
    let shouldSend200 = true;

    console.debug("request", req.headers);


    let date = new Date();
    const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
    const [hour, minutes, seconds, milliseconds, offset] = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), (date.getTimezoneOffset()/60)];

    let timeStr = ""+day +"/"+(month + 1)+"/"+year+" "+hour+":"+minutes+":"+seconds+"."+milliseconds+" UTC Offset (hours): "+offset;

    if(!req.headers['cache-control']){
      // console.log("1");
      let accepted_agents = ["Mozilla", "Chrome", "Safari"];
      // let accepted_agents = ["iOS"];

      if(!accepted_agents.some(e => req.headers['user-agent'].includes(e))){
        // console.log("2");
        shouldSend200 = false;
      }else{
        // console.log("3");
      }
    }else{
      // console.log("4");
    }

    if(shouldSend200){
      res.send({ 
        date_time_str: ""+timeStr,
        values:{
          day: day,
          month: (month + 1),
          year: year,
          hour: hour,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds,
          utc_offset_hours: offset
        },
        headers: req.headers
      });
    }else{
      res.status(403).send({ 
        error: "Wrong Request",
        headers: req.headers
      });
    }
  });

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

module.exports = app;