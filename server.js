const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')
mongoose.connect('mongodb://127.0.0.1:/urlShortner',
{useNewUrlParser:true,useUnifiedTopology:true})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/',async (req,res)=>{
    const fullUrl = ''
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls:shortUrls,fullUrl:fullUrl})
    
})

app.post('/shorturls',async (req,res)=>{
     await ShortUrl.create({full:req.body.fullUrl})
    res.redirect('/')

})

app.get('/longUrls', async (req,res)=>{
    // const shortUrls = await ShortUrl.find()
    const shortUrlParam = req.query.shortUrl; 
    console.log(shortUrlParam);
    const fullUrlDoc = await ShortUrl.findOne({ short: shortUrlParam });
    const shortUrls = await ShortUrl.find()

    if (!fullUrlDoc) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

    const fullUrl = fullUrlDoc.full;
    console.log(fullUrl);

    res.render('index',{shortUrls:shortUrls,fullUrl:fullUrl})
    // const fullUrl = await ShortUrl.findOne({short:req.params.fullUrl})
    // if(fullUrl==null ) return res.sendStatus(404).json({error:'url is required'})
    // console.log(fullUrl.full)
    // res.render('index',{shortUrls:shortUrls,fullUrl:fullUrl.full})
 })

app.get('/:shortUrl',async (req,res)=>{
    const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl==null) return res.sendStatus(404).json({error:'url is required'})
    // console.log("asdfgh")
    // shortUrl.deleteOne
    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.delete('/deleteUrl/:id', async (req, res) => {
        const idToDelete = req.params.id;
        await ShortUrl.findByIdAndRemove(idToDelete);
        res.sendStatus(204);
    
});

app.listen(5000);
