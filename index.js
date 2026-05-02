const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// دلته خپل نوی کاپي شوی کوډ واچوه
const genAI = new GoogleGenerativeAI("AIzaSyBL88gwU7bwgrTBMkcMhhO-nZw3G1fh008");

app.use(express.static('public'));
app.use(express.json());

app.post('/chat', upload.single('image'), async (req, res) => {
    try {
        console.log("پیغام راغی، ګوګل ته لېږل کیږي...");
        const userPrompt = req.body.prompt || "سلام";
        
        // دلته مو کوډ بیخي ساده کړ چې هیڅ خنډ جوړ نه کړي
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let parts = [userPrompt];

        if (req.file) {
            parts.push({ 
                inlineData: { 
                    data: req.file.buffer.toString("base64"), 
                    mimeType: req.file.mimetype 
                } 
            });
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        
        console.log("بریا! ځواب ویب پاڼې ته واستول شو.");
        res.json({ reply: response.text() });
        
    } catch (error) {
        console.error("ستونزه:", error.message);
        res.status(500).json({ error: "بښنه غواړم، ستونزه شته." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hiba AI is running on port ${PORT}`));