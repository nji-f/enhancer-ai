 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/api/proxy.js b/api/proxy.js
index b4ed9ce4d30adaf027c41bb9909bb48a3a0adac4..c82f72c6089a1da3f400a9aefaf44bc1a7a22475 100644
--- a/api/proxy.js
+++ b/api/proxy.js
@@ -1,23 +1,24 @@
 export default async function handler(req, res) {
   if (req.method !== 'POST') {
     return res.status(405).json({ error: 'Method not allowed' });
   }
 
   try {
   
     const response = await fetch("https://api.upscalepics.com/upscale-to-size", {
       method: "POST",
       headers: {
         "Origin": "https://upscalepics.com",
         "Referer": "https://upscalepics.com",
         "Content-Type": req.headers['content-type']
       },
     body: req // Teruskan stream body langsung
     body: req, // Teruskan stream body langsung
   duplex: "half"
     });
 
     const data = await response.json();
     res.status(200).json(data);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }
 
EOF
)
