const express = require('express');
const cors = require('cors');
const { crawlFileSystem } = require('./data/crawler/fileCrawler');
const { transformFileSystemData } = require('./data/dataTransformer');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.get('/api/filesystem', async (req, res) => {
  try {
    const rootDir = req.query.path || process.cwd();
    const rawData = await crawlFileSystem(rootDir);
    const transformedData = transformFileSystemData(rawData);
    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 