// =========================================================
// katalog.js — Modul 3: menampilkan katalog dengan DOM
// Praktikum Pemrograman Web 1 · Sasirangan Banua
// =========================================================

// 1. Data katalog: array yang berisi objek-objek produk
const katalog = [
  {
    id: 1,
    nama: "Kain Motif Gigi Haruan",
    kategori: "kain",
    harga: 185000,
    gambar: "img/gigi-haruan.svg",
    deskripsi:
      "Kain katun 2 meter bermotif zig-zag menyerupai gigi ikan haruan.",
  },
  {
    id: 2,
    nama: "Kain Motif Kambang Kacang",
    kategori: "kain",
    harga: 175000,
    gambar: "img/kambang-kacang.svg",
    deskripsi: "Motif bunga kacang yang melambangkan keakraban dan kerukunan.",
  },
  {
    id: 3,
    nama: "Selendang Iris Pudak",
    kategori: "aksesoris",
    harga: 120000,
    gambar: "img/iris-pudak.svg",
    deskripsi: "Selendang ringan bermotif irisan daun pudak (pandan).",
  },
  // ... lanjutkan untuk semua item (minimal 8 untuk tema Anda)
];

// 2. Ambil elemen-elemen HTML yang akan dimanipulasi
const daftarKatalog = document.querySelector("#daftar-katalog");
const inputCari = document.querySelector("#cari");
const tombolFilter = document.querySelectorAll(".tombol-filter");
const infoJumlah = document.querySelector("#info-jumlah");
// 3. Status filter yang sedang aktif
let kategoriAktif = "semua";
// 4. Mengubah angka menjadi format Rupiah, contoh: 185000 -> "Rp 185.000"
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// 5. Membuat elemen <article> untuk satu produk
function buatKartu(produk) {
  const kartu = document.createElement("article");
  kartu.className = "kartu";

  const gambar = document.createElement("img");
  gambar.src = produk.gambar;
  gambar.alt = produk.nama;
  gambar.width = 600;
  gambar.height = 400;
  gambar.loading = "lazy";

  const isi = document.createElement("div");
  isi.className = "kartu-isi";

  const label = document.createElement("span");
  label.className = "label-kategori";
  label.textContent = produk.kategori;

  const judul = document.createElement("h3");
  judul.textContent = produk.nama;

  const deskripsi = document.createElement("p");
  deskripsi.textContent = produk.deskripsi;

  const harga = document.createElement("p");
  harga.className = "harga";
  harga.textContent = formatRupiah(produk.harga);

  isi.append(label, judul, deskripsi, harga);
  kartu.append(gambar, isi);
  return kartu;
}

// 6. Menampilkan sekumpulan produk ke dalam #daftar-katalog
function tampilkanKatalog(daftarProduk) {
  daftarKatalog.replaceChildren(); // kosongkan isi sebelumnya
  if (daftarProduk.length === 0) {
    const kosong = document.createElement("p");
    kosong.textContent = "Produk tidak ditemukan. Coba kata kunci lain.";
    daftarKatalog.append(kosong);
  }
  daftarProduk.forEach((produk) => {
    daftarKatalog.append(buatKartu(produk));
  });
  infoJumlah.textContent = `Menampilkan ${daftarProduk.length} dari ${katalog.length} produk`;
}

// 7. Menyaring katalog berdasarkan kata kunci DAN kategori aktif
function saringKatalog() {
    const kataKunci = inputCari.value.trim().toLowerCase();
    const hasil = katalog.filter((produk) => {
        const cocokKategori = kategoriAktif === "semua" || produk.kategori === kategoriAktif;
        const cocokKata =
            produk.nama.toLowerCase().includes(kataKunci)
        produk.deskripsi.toLowerCase().includes(kataKunci);
        return cocokKategori && cocokKata;
    });
    tampilkanKatalog(hasil);
}
// 8. Event: setiap kali pengguna mengetik di kotak pencarian
inputCari.addEventListener("input", saringKatalog);

// 9. Event: klik tombol filter kategori
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    kategoriAktif = tombol.dataset.kategori;
    // perbarui tampilan tombol: hanya satu yang aktif
    tombolFilter.forEach((t) => {
      t.classList.remove("aktif");
      t.setAttribute("aria-pressed", "false");
    });
    tombol.classList.add("aktif");
    tombol.setAttribute("aria-pressed", "true");
    saringKatalog();
  });
});

// 10. Tampilkan semua produk ketika halaman pertama kali dibuka
tampilkanKatalog(katalog);
