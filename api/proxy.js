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
      body: req, // Teruskan stream body langsung
      duplex: "half"
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
