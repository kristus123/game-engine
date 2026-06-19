export async function LibreTranslate(text) {
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: "es",
      format: "text",
    })
  });

  const data = await res.json();

  return data.translatedText;
}
