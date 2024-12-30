const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); 
const cors = require('cors');
const Village = require('./Models/VillageSchema'); 
const path = require('path');
const app = express();
const port = 5000;
app.use(cors());
//+++++++++++++++++++++++++++++++++++++++++++++phto path ++++++++++++++++++++++++++++++++ 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//++++++++++++++++++++++++++++++++ Handell   with   uplode Imges +++++++++++++++++++++++++++++++++
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
//++++++++++++++++++++++++++++++++ End Handell with uplode Imges +++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++ Connection With  database +++++++++++++++++++++++++++++++++

mongoose.connect('mongodb+srv://sazyo:sazyo123@sazyo.1wznb.mongodb.net/?retryWrites=true&w=majority&appName=sazyo')
  .then(() => console.log("Database connection successful"))
  .catch(err => console.log("Database connection failed", err));


//++++++++++++++++++++++++++++++++ Add new Valige in database +++++++++++++++++++++++++++++++++
app.post('/village-management', upload.single('uploadImage'), async (req, res) => {
  try {
    const { villageName, region, landArea, latitude, longitude, categories } = req.body;
    const uploadImage = req.file ? req.file.path : null;

    const newVillage = new Village({
      villageName,
      region,
      landArea,
      latitude,
      longitude,
      uploadImage,
      categories: categories.split(',').map((category) => category.trim()),  
    });

    await newVillage.save();
    res.status(201).json(newVillage);  
  } catch (error) {
    res.status(500).json({ error: 'Error while adding village' });
  }
});
//++++++++++++++++++++++++++++++++End Add new Valige in database +++++++++++++++++++++++++++++++++


  //++++++++++++++++++++++++++++++++diblay Valige in contarner +++++++++++++++++++++++++++++++++
  app.get('/api/villages', async (req, res) => {
    try {
      const villages = await Village.find();  // جلب جميع القرى من قاعدة البيانات
      res.status(200).json(villages);  // إرسال البيانات إلى العميل
    } catch (error) {
      res.status(500).json({ error: 'Error fetching villages' });
    }
  });
 //++++++++++++++++++++++++++++++++diblay Valige in contarner +++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++ Deleat Valige  +++++++++++++++++++++++++++++++++
  app.delete('/api/villages/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const village = await Village.findByIdAndDelete(id);  
      if (!village) {
        return res.status(404).json({ message: 'Village not found' });
      }
      res.status(200).json({ message: 'Village deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting village' });
    }
  });
//++++++++++++++++++++++++++++++++End Deleat Valige  +++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++Up date Valige +++++++++++++++++++++++++++++++++
app.get('/api/villages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const village = await Village.findById(id); // استخدام findById لاسترجاع القرية حسب الـ ID
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    res.json(village); // إرسال القرية إلى العميل
  } catch (error) {
    console.error('Error fetching village:', error);
    res.status(500).json({ message: 'Error fetching village' });
  }
});


app.put('/api/villages/:id', upload.single('uploadImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { villageName, region, landArea, latitude, longitude, categories } = req.body;

    const updatedData = {
      villageName,
      region,
      landArea,
      latitude,
      longitude,
      categories: categories ? categories.split(',').map((c) => c.trim()) : [],
    };

    // إذا تم رفع صورة جديدة، أضف المسار إلى البيانات
    if (req.file) {
      updatedData.imagePath = req.file.path; // حفظ مسار الصورة في قاعدة البيانات
    }

    const updatedVillage = await Village.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedVillage) {
      return res.status(404).json({ error: 'Village not found' });
    }

    res.json(updatedVillage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//++++++++++++++++++++++++++++++++End Up date Valige  +++++++++++++++++++++++++++++++++


app.listen(port, () => {
  console.log(`server run on :: http://localhost:${port}`);
});
