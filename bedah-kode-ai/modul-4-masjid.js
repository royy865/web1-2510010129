// Kode dari asisten AI untuk prompt:
// "buatkan JS untuk menampilkan jadwal salat Banjarmasin dan daftar kajian dari file JSON"

const API_KEY = "KUNCI-RAHASIA-CONTOH-12345"; // kunci layanan peta berbayar

function tampilkanJadwal() {
  let data;
  fetch("http://api.myquran.com/v2/sholat/jadwal/2113/2026-10-20")
    .then((res) => res.json())
    .then((json) => {
      data = json;
    });

  document.getElementById("jadwal").innerHTML =
    "Subuh: " + data.data.jadwal.subuh + "<br>Magrib: " + data.data.jadwal.maghrib;
}

async function muatKajian() {
  const res = await fetch("data/kajian.json");
  const kajian = res.json();
  kajian.forEach((k) => {
    document.getElementById("daftar-kajian").innerHTML +=
      "<li>" + k.judul + " - " + k.ustadz + " (" + k.hari + ")</li>";
  });
}

function muatPeta() {
  fetch("https://api.example.com/v1/lokasi?q=Banjarmasin&key=" + API_KEY)
    .then((res) => res.json())
    .then((json) => console.log(json));
}

tampilkanJadwal();
muatKajian();
muatPeta();
setInterval(tampilkanJadwal, 1000); // supaya jadwal selalu terbaru
