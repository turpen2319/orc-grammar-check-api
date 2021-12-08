const express = require('express');
const fs = require('fs');
const Jimp = require('jimp');
const base64Img = require('base64-img');
const cors = require('cors');
const PORT = 3001;


const handwriting = require('./controllers/handwriting');




const app = express();
app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(express.static('./uploads'));


//running google api
// const fileName = './example-text.png';



//ROUTES
// app.post('/webcam-submit', (req, res) => {handwriting.detectHandwriting(req, res)})

app.post('/test', (req, res) => {
  const { base64 } = req.body;
  base64Img.img(base64, './uploads', Date.now(), function(err, filepath) {
    const pathArr = filepath.split('/');
    const fileName = pathArr[pathArr.length - 1];

    (async () => {
      const handwritingData = await handwriting.detectHandwriting(fileName);
      res.status(200).json({
        success: true,
        url: `http:127.0.0.1:${PORT}/${fileName}`,
        handwritingRes: handwritingData 
      })
    })();

    // handwriting.detectHandwriting(fileName).then(data => {
    //   console.log(`working? ${data}`);
    //   res.status(200).json({
    //     success: true,
    //     url: `http:127.0.0.1:${PORT}/${fileName}`,
    //     handwritingRes: data 
    //   })
    // })

    
  })
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

/*

/ --> GET = this is working
/webcam-submit --> POST = returns object list with google api and grammar data for each word
/user-upload --> POST = returns same as webcam-submit
/ 

*/