export default async function handler(req, res) {
  try {
    const forwarded =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      "";

    const ip = forwarded.split(",")[0].trim() || "Unknown";

    let country = "?";
    let city = "?";
    let isp = "?";

    try {
      const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,query`);
      const d = await r.json();

      if (d && d.status === "success") {
        country = d.country || "?";
        city = d.city || "?";
        isp = d.isp || "?";
      }
    } catch {}

    res.status(200).json({
      ok: true,
      ip,
      country,
      city,
      isp
    });
  } catch (e) {
    res.status(200).json({
      ok: false,
      ip: "?",
      country: "?",
      city: "?",
      isp: "?"
    });
  }
}