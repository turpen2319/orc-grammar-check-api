
async function detectHandwriting(fileName) {   

  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');
  
  // Creates a google vision client
  const client = new vision.ImageAnnotatorClient();
  
  // Imports grammarbot package
  const Grammarbot = require('grammarbot');

  //Creates new grammarbot client
  const bot = new Grammarbot({
    'api_key' : '7d50f38fb7mshc0aae465d43edcbp1b047ejsn387704e383b8', // (Optional) defaults to node_default
    'language': 'en-US', // (Optional) defaults to en-US
    'base_uri': 'api.grammarbot.io', // (Optional) defaults to api.grammarbot.io
  });

  
  //object list including grammar check results and data on each word
  const myData = [];

  // Read a local image as a text document
  const [result] = await client.documentTextDetection(fileName);

  //get text from result
  const fullTextAnnotation = result.fullTextAnnotation;
  const fullText = fullTextAnnotation.text;
  myData.push({fullText: fullText})
  console.log(`Full text: ${fullText}`);

  
  //checking grammar
  const grammarResult = await bot.checkAsync(fullText);
  const grammarData  = grammarResult.matches;
  // console.log(JSON.stringify(grammarResult));
  myData.push(grammarData);

  //getting data for each word in the handwritten text
  let cursor = 0;
  fullTextAnnotation.pages.forEach(page => {
    page.blocks.forEach(block => {
      console.log(`Block confidence: ${block.confidence}`);
      block.paragraphs.forEach(paragraph => {
        console.log(`Paragraph confidence: ${paragraph.confidence}`);
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join('');
          
          const vertices = word.boundingBox.vertices;
          
          const wordLength = wordText.length;

          const offset = fullText.indexOf(wordText, cursor);

          cursor = offset + wordLength;
          


          const wordData = {
            word: wordText,
            confidence: word.confidence,
            offset: offset,
            length: wordLength,
            cursor: cursor,
            x1: vertices[0].x,
            y1: vertices[0].y,
            x2: vertices[1].x,
            y2: vertices[1].y,
            x3: vertices[2].x,
            y3: vertices[2].y,
            x4: vertices[3].x,
            y4: vertices[3].y
          }
          myData.push(wordData)
          console.log(wordData);

          

        });
      });
    });
  });


  return myData
}

module.exports = {
  detectHandwriting: detectHandwriting
}